# React Native + Frappe ERPNext Complete Setup Guide

## Prerequisites & Environment Setup

### Development Environment
```bash
# Install Node.js (LTS version)
# Install React Native CLI
npm install -g react-native-cli

# For iOS development (macOS only)
# Install Xcode from App Store
# Install CocoaPods
sudo gem install cocoapods

# For Android development
# Install Android Studio
# Configure Android SDK and AVD
```

### Frappe/ERPNext Setup
```bash
# Install Frappe Bench
pip3 install frappe-bench

# Create new bench
bench init my-erpnext --frappe-branch version-14
cd my-erpnext

# Install ERPNext
bench get-app erpnext --branch version-14
bench new-site your-site.localhost --install-app erpnext

# Start development server
bench start
```

## Project Structure Setup

### 1. Initialize React Native Project
```bash
npx react-native init ERPNextMobile
cd ERPNextMobile

# Install essential dependencies
npm install @reduxjs/toolkit react-redux
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
```

### 2. Project Directory Structure
```
ERPNextMobile/
├── src/
│   ├── api/
│   │   ├── frappeApi.js
│   │   ├── endpoints.js
│   │   └── interceptors.js
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   └── lists/
│   ├── screens/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── modules/
│   ├── store/
│   │   ├── slices/
│   │   └── index.js
│   ├── utils/
│   │   ├── storage.js
│   │   ├── validation.js
│   │   └── helpers.js
│   └── navigation/
│       └── AppNavigator.js
├── android/
├── ios/
└── package.json
```

## API Layer Implementation

### 1. Base API Configuration
```javascript
// src/api/frappeApi.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class FrappeAPI {
  constructor() {
    this.baseURL = 'http://your-site.localhost:8000';
    this.token = null;
    this.cookies = null;
  }

  async initialize() {
    // Load stored credentials
    this.token = await AsyncStorage.getItem('frappe_token');
    this.cookies = await AsyncStorage.getItem('frappe_cookies');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add authentication headers
    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }
    
    if (this.cookies) {
      defaultHeaders['Cookie'] = this.cookies;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      // Handle authentication errors
      if (response.status === 401) {
        await this.logout();
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      return { data, response };
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(username, password) {
    try {
      const { data, response } = await this.request('/api/method/login', {
        method: 'POST',
        body: JSON.stringify({
          usr: username,
          pwd: password,
        }),
      });

      if (data.message === 'Logged In') {
        // Extract cookies for session management
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
          this.cookies = setCookie;
          await AsyncStorage.setItem('frappe_cookies', setCookie);
        }

        // Get user info
        const userInfo = await this.getCurrentUser();
        return { success: true, user: userInfo };
      }
      
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async logout() {
    try {
      await this.request('/api/method/logout', { method: 'POST' });
    } finally {
      this.token = null;
      this.cookies = null;
      await AsyncStorage.multiRemove(['frappe_token', 'frappe_cookies']);
    }
  }

  async getCurrentUser() {
    const { data } = await this.request('/api/method/frappe.auth.get_logged_user');
    return data.message;
  }

  // Document CRUD operations
  async getDocument(doctype, name) {
    const { data } = await this.request(`/api/resource/${doctype}/${name}`);
    return data.data;
  }

  async getDocumentList(doctype, filters = {}, fields = [], limit = 20) {
    const params = new URLSearchParams({
      fields: JSON.stringify(fields),
      filters: JSON.stringify(filters),
      limit_page_length: limit,
    });

    const { data } = await this.request(`/api/resource/${doctype}?${params}`);
    return data.data;
  }

  async createDocument(doctype, doc) {
    const { data } = await this.request(`/api/resource/${doctype}`, {
      method: 'POST',
      body: JSON.stringify(doc),
    });
    return data.data;
  }

  async updateDocument(doctype, name, doc) {
    const { data } = await this.request(`/api/resource/${doctype}/${name}`, {
      method: 'PUT',
      body: JSON.stringify(doc),
    });
    return data.data;
  }

  async deleteDocument(doctype, name) {
    await this.request(`/api/resource/${doctype}/${name}`, {
      method: 'DELETE',
    });
  }

  // ERPNext specific methods
  async getCustomerList(filters = {}) {
    return this.getDocumentList('Customer', filters, [
      'name', 'customer_name', 'customer_type', 'territory'
    ]);
  }

  async getItemList(filters = {}) {
    return this.getDocumentList('Item', filters, [
      'name', 'item_name', 'item_code', 'standard_rate', 'stock_uom'
    ]);
  }

  async getSalesOrderList(filters = {}) {
    return this.getDocumentList('Sales Order', filters, [
      'name', 'customer', 'transaction_date', 'grand_total', 'status'
    ]);
  }

  async createSalesOrder(orderData) {
    return this.createDocument('Sales Order', orderData);
  }
}

export default new FrappeAPI();
```

### 2. Redux Store Setup
```javascript
// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FrappeAPI from '../../api/frappeApi';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const result = await FrappeAPI.login(username, password);
      if (result.success) {
        return result.user;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await FrappeAPI.logout();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
```

```javascript
// src/store/slices/erpSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FrappeAPI from '../../api/frappeApi';

export const fetchCustomers = createAsyncThunk(
  'erp/fetchCustomers',
  async (filters = {}) => {
    return await FrappeAPI.getCustomerList(filters);
  }
);

export const fetchItems = createAsyncThunk(
  'erp/fetchItems',
  async (filters = {}) => {
    return await FrappeAPI.getItemList(filters);
  }
);

export const fetchSalesOrders = createAsyncThunk(
  'erp/fetchSalesOrders',
  async (filters = {}) => {
    return await FrappeAPI.getSalesOrderList(filters);
  }
);

export const createSalesOrder = createAsyncThunk(
  'erp/createSalesOrder',
  async (orderData) => {
    return await FrappeAPI.createSalesOrder(orderData);
  }
);

const erpSlice = createSlice({
  name: 'erp',
  initialState: {
    customers: [],
    items: [],
    salesOrders: [],
    loading: {
      customers: false,
      items: false,
      salesOrders: false,
    },
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading.customers = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading.customers = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading.customers = false;
        state.error = action.error.message;
      })
      // Items
      .addCase(fetchItems.pending, (state) => {
        state.loading.items = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading.items = false;
        state.items = action.payload;
      })
      // Sales Orders
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.loading.salesOrders = false;
        state.salesOrders = action.payload;
      });
  },
});

export const { clearError } = erpSlice.actions;
export default erpSlice.reducer;
```

```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import erpReducer from './slices/erpSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    erp: erpReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Screen Components

### 1. Login Screen
```javascript
// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      const result = await dispatch(loginUser({ username, password }));
      if (loginUser.fulfilled.match(result)) {
        navigation.replace('Dashboard');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ERPNext Mobile</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;
```

### 2. Dashboard Screen
```javascript
// src/screens/dashboard/DashboardScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, fetchItems, fetchSalesOrders } from '../../store/slices/erpSlice';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { customers, items, salesOrders } = useSelector((state) => state.erp);

  useEffect(() => {
    // Load initial data
    dispatch(fetchCustomers());
    dispatch(fetchItems());
    dispatch(fetchSalesOrders());
  }, [dispatch]);

  const menuItems = [
    {
      title: 'Customers',
      count: customers.length,
      onPress: () => navigation.navigate('CustomerList'),
      color: '#28a745',
    },
    {
      title: 'Items',
      count: items.length,
      onPress: () => navigation.navigate('ItemList'),
      color: '#17a2b8',
    },
    {
      title: 'Sales Orders',
      count: salesOrders.length,
      onPress: () => navigation.navigate('SalesOrderList'),
      color: '#ffc107',
    },
    {
      title: 'Create Sales Order',
      onPress: () => navigation.navigate('CreateSalesOrder'),
      color: '#dc3545',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user}!</Text>
      
      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: item.color }]}
            onPress={item.onPress}
          >
            <Text style={styles.menuTitle}>{item.title}</Text>
            {item.count !== undefined && (
              <Text style={styles.menuCount}>{item.count}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  menuItem: {
    width: '45%',
    margin: '2.5%',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  menuTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuCount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default DashboardScreen;
```

### 3. Customer List Screen
```javascript
// src/screens/modules/CustomerListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../../store/slices/erpSlice';

const CustomerListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state.erp);
  const [searchText, setSearchText] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (searchText) {
      const filtered = customers.filter(customer =>
        customer.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customers, searchText]);

  const renderCustomer = ({ item }) => (
    <TouchableOpacity
      style={styles.customerItem}
      onPress={() => navigation.navigate('CustomerDetail', { customer: item })}
    >
      <Text style={styles.customerName}>{item.customer_name}</Text>
      <Text style={styles.customerCode}>{item.name}</Text>
      <Text style={styles.customerType}>{item.customer_type}</Text>
    </TouchableOpacity>
  );

  const onRefresh = () => {
    dispatch(fetchCustomers());
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search customers..."
        value={searchText}
        onChangeText={setSearchText}
      />
      
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.name}
        refreshControl={
          <RefreshControl
            refreshing={loading.customers}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No customers found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  customerItem: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  customerCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  customerType: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default CustomerListScreen;
```

## Navigation Setup

```javascript
// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import LoginScreen from '../screens/auth/LoginScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CustomerListScreen from '../screens/modules/CustomerListScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#007bff' }, headerTintColor: '#fff' }}>
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ title: 'ERPNext Dashboard' }}
            />
            <Stack.Screen
              name="CustomerList"
              component={CustomerListScreen}
              options={{ title: 'Customers' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

## Main App Component

```javascript
// App.js
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import FrappeAPI from './src/api/frappeApi';

const App = () => {
  useEffect(() => {
    // Initialize API on app start
    FrappeAPI.initialize();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
```

## Running the Application

### 1. Start Frappe Development Server
```bash
cd my-erpnext
bench start
```

### 2. Configure Network Access
```bash
# In your Frappe site, enable CORS
bench --site your-site.localhost set-config developer_mode 1
bench --site your-site.localhost add-to-hosts
```

### 3. Run React Native App
```bash
# For Android
npx react-native run-android

# For iOS
npx react-native run-ios
```

## Next Steps

1. **Implement offline synchronization** using AsyncStorage
2. **Add push notifications** for real-time updates
3. **Implement file upload/download** functionality
4. **Add more ERPNext modules** (Purchase, Inventory, etc.)
5. **Implement proper error handling** and loading states
6. **Add unit tests** for API and components
7. **Optimize performance** with pagination and caching

This setup provides a solid foundation for building a React Native app with Frappe ERPNext backend. The architecture is scalable and follows React Native best practices while properly integrating with Frappe's API structure.