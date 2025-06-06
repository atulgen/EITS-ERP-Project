# React Native + TypeScript + Frappe ERPNext Complete Setup Guide

## Project Initialization with TypeScript

### 1. Create React Native TypeScript Project
```bash
npx react-native@latest init ERPNextMobile --template react-native-template-typescript
cd ERPNextMobile

# Install essential dependencies
npm install @reduxjs/toolkit react-redux
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# Install TypeScript types
npm install -D @types/react-native-vector-icons
npm install -D @types/react-redux
```

### 2. Project Structure with TypeScript
```
ERPNextMobile/
├── src/
│   ├── api/
│   │   ├── frappeApi.ts
│   │   ├── types.ts
│   │   └── endpoints.ts
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
│   │   └── index.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── navigation.ts
│   │   └── erp.ts
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   └── navigation/
│       └── AppNavigator.tsx
├── android/
├── ios/
└── package.json
```

## TypeScript Type Definitions

### 1. API Types
```typescript
// src/types/api.ts
export interface FrappeResponse<T = any> {
  data: T;
  message?: string;
}

export interface FrappeListResponse<T> {
  data: T[];
  count?: number;
}

export interface FrappeError {
  message: string;
  exc?: string;
  exc_type?: string;
}

export interface LoginCredentials {
  usr: string;
  pwd: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: string;
}

export interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface DocumentFilters {
  [key: string]: string | number | boolean | string[];
}

export interface ListOptions {
  fields?: string[];
  filters?: DocumentFilters;
  limit?: number;
  order_by?: string;
}
```

### 2. ERPNext Types
```typescript
// src/types/erp.ts
export interface Customer {
  name: string;
  customer_name: string;
  customer_type: 'Individual' | 'Company';
  territory?: string;
  customer_group?: string;
  mobile_no?: string;
  email_id?: string;
  creation: string;
  modified: string;
}

export interface Item {
  name: string;
  item_name: string;
  item_code: string;
  item_group: string;
  standard_rate: number;
  stock_uom: string;
  description?: string;
  image?: string;
  has_variants: 0 | 1;
  is_stock_item: 0 | 1;
}

export interface SalesOrder {
  name: string;
  customer: string;
  customer_name?: string;
  transaction_date: string;
  delivery_date?: string;
  grand_total: number;
  status: 'Draft' | 'To Deliver and Bill' | 'To Bill' | 'To Deliver' | 'Completed' | 'Cancelled';
  items: SalesOrderItem[];
}

export interface SalesOrderItem {
  item_code: string;
  item_name?: string;
  qty: number;
  rate: number;
  amount: number;
  uom?: string;
  description?: string;
}

export interface CreateSalesOrderData {
  customer: string;
  transaction_date: string;
  delivery_date?: string;
  items: {
    item_code: string;
    qty: number;
    rate: number;
  }[];
}
```

### 3. Redux Types
```typescript
// src/types/redux.ts
export interface AuthState {
  user: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ERPState {
  customers: Customer[];
  items: Item[];
  salesOrders: SalesOrder[];
  loading: {
    customers: boolean;
    items: boolean;
    salesOrders: boolean;
  };
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  erp: ERPState;
}
```

### 4. Navigation Types
```typescript
// src/types/navigation.ts
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Customer, Item, SalesOrder } from './erp';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  CustomerList: undefined;
  CustomerDetail: { customer: Customer };
  ItemList: undefined;
  ItemDetail: { item: Item };
  SalesOrderList: undefined;
  SalesOrderDetail: { salesOrder: SalesOrder };
  CreateSalesOrder: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
export type CustomerListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CustomerList'>;

export type CustomerDetailScreenRouteProp = RouteProp<RootStackParamList, 'CustomerDetail'>;
export type CustomerDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CustomerDetail'>;

// Screen props types
export interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

export interface CustomerListScreenProps {
  navigation: CustomerListScreenNavigationProp;
}

export interface CustomerDetailScreenProps {
  navigation: CustomerDetailScreenNavigationProp;
  route: CustomerDetailScreenRouteProp;
}
```

## TypeScript API Implementation

### 1. Frappe API Class
```typescript
// src/api/frappeApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FrappeResponse,
  FrappeListResponse,
  LoginCredentials,
  LoginResponse,
  ApiRequestOptions,
  DocumentFilters,
  ListOptions,
} from '../types/api';
import { Customer, Item, SalesOrder, CreateSalesOrderData } from '../types/erp';

class FrappeAPI {
  private baseURL: string;
  private token: string | null = null;
  private cookies: string | null = null;

  constructor() {
    this.baseURL = 'http://your-site.localhost:8000';
  }

  async initialize(): Promise<void> {
    this.token = await AsyncStorage.getItem('frappe_token');
    this.cookies = await AsyncStorage.getItem('frappe_cookies');
  }

  private async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<{ data: T; response: Response }> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

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

      if (response.status === 401) {
        await this.logout();
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data, response };
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const credentials: LoginCredentials = {
        usr: username,
        pwd: password,
      };

      const { data, response } = await this.request<FrappeResponse>('/api/method/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (data.message === 'Logged In') {
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
          this.cookies = setCookie;
          await AsyncStorage.setItem('frappe_cookies', setCookie);
        }

        const userInfo = await this.getCurrentUser();
        return { success: true, user: userInfo };
      }
      
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/method/logout', { method: 'POST' });
    } finally {
      this.token = null;
      this.cookies = null;
      await AsyncStorage.multiRemove(['frappe_token', 'frappe_cookies']);
    }
  }

  async getCurrentUser(): Promise<string> {
    const { data } = await this.request<FrappeResponse<string>>('/api/method/frappe.auth.get_logged_user');
    return data.message;
  }

  // Generic document operations
  async getDocument<T = any>(doctype: string, name: string): Promise<T> {
    const { data } = await this.request<FrappeResponse<T>>(`/api/resource/${doctype}/${name}`);
    return data.data;
  }

  async getDocumentList<T = any>(
    doctype: string,
    options: ListOptions = {}
  ): Promise<T[]> {
    const { fields = [], filters = {}, limit = 20, order_by } = options;
    
    const params = new URLSearchParams();
    
    if (fields.length > 0) {
      params.append('fields', JSON.stringify(fields));
    }
    
    if (Object.keys(filters).length > 0) {
      params.append('filters', JSON.stringify(filters));
    }
    
    params.append('limit_page_length', limit.toString());
    
    if (order_by) {
      params.append('order_by', order_by);
    }

    const { data } = await this.request<FrappeListResponse<T>>(`/api/resource/${doctype}?${params}`);
    return data.data;
  }

  async createDocument<T = any>(doctype: string, doc: Partial<T>): Promise<T> {
    const { data } = await this.request<FrappeResponse<T>>(`/api/resource/${doctype}`, {
      method: 'POST',
      body: JSON.stringify(doc),
    });
    return data.data;
  }

  async updateDocument<T = any>(doctype: string, name: string, doc: Partial<T>): Promise<T> {
    const { data } = await this.request<FrappeResponse<T>>(`/api/resource/${doctype}/${name}`, {
      method: 'PUT',
      body: JSON.stringify(doc),
    });
    return data.data;
  }

  async deleteDocument(doctype: string, name: string): Promise<void> {
    await this.request(`/api/resource/${doctype}/${name}`, {
      method: 'DELETE',
    });
  }

  // ERPNext specific methods
  async getCustomerList(filters: DocumentFilters = {}): Promise<Customer[]> {
    return this.getDocumentList<Customer>('Customer', {
      filters,
      fields: ['name', 'customer_name', 'customer_type', 'territory', 'mobile_no', 'email_id'],
      order_by: 'customer_name',
    });
  }

  async getItemList(filters: DocumentFilters = {}): Promise<Item[]> {
    return this.getDocumentList<Item>('Item', {
      filters,
      fields: ['name', 'item_name', 'item_code', 'standard_rate', 'stock_uom', 'item_group'],
      order_by: 'item_name',
    });
  }

  async getSalesOrderList(filters: DocumentFilters = {}): Promise<SalesOrder[]> {
    return this.getDocumentList<SalesOrder>('Sales Order', {
      filters,
      fields: ['name', 'customer', 'customer_name', 'transaction_date', 'grand_total', 'status'],
      order_by: 'creation desc',
    });
  }

  async createSalesOrder(orderData: CreateSalesOrderData): Promise<SalesOrder> {
    return this.createDocument<SalesOrder>('Sales Order', orderData);
  }

  async getCustomer(name: string): Promise<Customer> {
    return this.getDocument<Customer>('Customer', name);
  }

  async getItem(name: string): Promise<Item> {
    return this.getDocument<Item>('Item', name);
  }

  async getSalesOrder(name: string): Promise<SalesOrder> {
    return this.getDocument<SalesOrder>('Sales Order', name);
  }
}

export default new FrappeAPI();
```

## Redux Store with TypeScript

### 1. Auth Slice
```typescript
// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../../types/redux';
import FrappeAPI from '../../api/frappeApi';

interface LoginCredentials {
  username: string;
  password: string;
}

export const loginUser = createAsyncThunk
  string, // return type
  LoginCredentials, // arg type
  { rejectValue: string }
>(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const result = await FrappeAPI.login(username, password);
      if (result.success && result.user) {
        return result.user;
      } else {
        return rejectWithValue(result.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logoutUser = createAsyncThunk<void, void>(
  'auth/logout',
  async () => {
    await FrappeAPI.logout();
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
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
        state.error = action.payload || 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
```

### 2. ERP Slice
```typescript
// src/store/slices/erpSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ERPState } from '../../types/redux';
import { Customer, Item, SalesOrder, CreateSalesOrderData } from '../../types/erp';
import { DocumentFilters } from '../../types/api';
import FrappeAPI from '../../api/frappeApi';

export const fetchCustomers = createAsyncThunk<Customer[], DocumentFilters>(
  'erp/fetchCustomers',
  async (filters = {}) => {
    return await FrappeAPI.getCustomerList(filters);
  }
);

export const fetchItems = createAsyncThunk<Item[], DocumentFilters>(
  'erp/fetchItems',
  async (filters = {}) => {
    return await FrappeAPI.getItemList(filters);
  }
);

export const fetchSalesOrders = createAsyncThunk<SalesOrder[], DocumentFilters>(
  'erp/fetchSalesOrders',
  async (filters = {}) => {
    return await FrappeAPI.getSalesOrderList(filters);
  }
);

export const createSalesOrder = createAsyncThunk<SalesOrder, CreateSalesOrderData>(
  'erp/createSalesOrder',
  async (orderData) => {
    return await FrappeAPI.createSalesOrder(orderData);
  }
);

const initialState: ERPState = {
  customers: [],
  items: [],
  salesOrders: [],
  loading: {
    customers: false,
    items: false,
    salesOrders: false,
  },
  error: null,
};

const erpSlice = createSlice({
  name: 'erp',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(c => c.name === action.payload.name);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading.customers = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading.customers = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading.customers = false;
        state.error = action.error.message || 'Failed to fetch customers';
      })
      // Items
      .addCase(fetchItems.pending, (state) => {
        state.loading.items = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading.items = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading.items = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      // Sales Orders
      .addCase(fetchSalesOrders.pending, (state) => {
        state.loading.salesOrders = true;
        state.error = null;
      })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.loading.salesOrders = false;
        state.salesOrders = action.payload;
      })
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.loading.salesOrders = false;
        state.error = action.error.message || 'Failed to fetch sales orders';
      })
      // Create Sales Order
      .addCase(createSalesOrder.fulfilled, (state, action) => {
        state.salesOrders.unshift(action.payload);
      });
  },
});

export const { clearError, addCustomer, updateCustomer } = erpSlice.actions;
export default erpSlice.reducer;
```

### 3. Store Configuration
```typescript
// src/store/index.ts
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

// Typed hooks
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## TypeScript Components

### 1. Login Screen
```typescript
// src/screens/auth/LoginScreen.tsx
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
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser } from '../../store/slices/authSlice';
import { LoginScreenProps } from '../../types/navigation';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (): Promise<void> => {
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
      Alert.alert('Login Failed', (error as Error).message);
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
        autoCorrect={false}
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
```typescript
// src/screens/dashboard/DashboardScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCustomers, fetchItems, fetchSalesOrders } from '../../store/slices/erpSlice';
import { DashboardScreenProps } from '../../types/navigation';

interface MenuItem {
  title: string;
  count?: number;
  onPress: () => void;
  color: string;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { customers, items, salesOrders } = useAppSelector((state) => state.erp);

  useEffect(() => {
    // Load initial data
    dispatch(fetchCustomers());
    dispatch(fetchItems());
    dispatch(fetchSalesOrders());
  }, [dispatch]);

  const menuItems: MenuItem[] = [
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
        {menuItems.map((item: MenuItem, index: number) => (
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
```typescript
// src/screens/modules/CustomerListScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  ListRenderItem,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCustomers } from '../../store/slices/erpSlice';
import { Customer } from '../../types/erp';
import { CustomerListScreenProps } from '../../types/navigation';

const CustomerListScreen: React.FC<CustomerListScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { customers, loading } = useAppSelector((state) => state.erp);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (searchText) {
      const filtered = customers.filter((customer: Customer) =>
        customer.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customers, searchText]);

  const renderCustomer: ListRenderItem<Customer> = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.customerItem}
      onPress={() => navigation.navigate('CustomerDetail', { customer: item })}
    >
      <Text style={styles.customerName}>{item.customer_name}</Text>
      <Text style={styles.customerCode}>{item.name}</Text>
      <Text style={styles.customerType}>{item.customer_type}</Text>
      {item.mobile_no && (
        <Text style={styles.customerPhone}>{item.mobile_no}</Text>
      )}
    </TouchableOpacity>
  ), [navigation]);

  const onRefresh = useCallback(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const keyExtractor = useCallback((item: Customer) => item.name, []);

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
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            refreshing={loading.customers}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No customers found</Text>

```