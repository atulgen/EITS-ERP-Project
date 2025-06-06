# React Native + Frappe/ERPNext Development Guide

## Understanding the Stack Architecture

### Frappe Framework Overview
Frappe is a full-stack web application framework built on Python that provides:
- **REST API layer** - Automatic API generation for all DocTypes
- **Authentication system** - Token-based and session-based auth
- **Database abstraction** - Built on MariaDB/MySQL
- **WebSocket support** - Real-time updates
- **File management** - Document attachments and media handling

### ERPNext Integration
ERPNext is built on Frappe and provides:
- Pre-built business modules (Sales, Purchase, Accounting, etc.)
- Custom field extensions
- Workflow management
- Report generation APIs
- Multi-company/multi-currency support

## PWA Capabilities with Frappe

Frappe has excellent PWA support out of the box:

### Built-in PWA Features
- **Service Worker** - Automatic caching and offline functionality
- **App Manifest** - Configurable through Frappe settings
- **Push Notifications** - Integrated with Frappe's notification system
- **Offline Storage** - IndexedDB integration for local data caching

### Enabling PWA in Frappe
```python
# In your app's hooks.py
app_include_js = [
    "assets/js/app.min.js"
]

# PWA configuration
pwa_context = {
    "app_name": "Your App Name",
    "short_name": "YourApp",
    "theme_color": "#3498db",
    "background_color": "#ffffff"
}
```

### PWA vs React Native Considerations
**Choose PWA when:**
- Primary web usage with mobile as secondary
- Rapid development needed
- Limited native device features required
- Want to leverage Frappe's built-in UI components

**Choose React Native when:**
- Native performance is critical
- Need extensive device API access (camera, GPS, push notifications)
- Want platform-specific UI/UX
- Offline-first architecture required

## React Native + Frappe Integration

### API Communication Strategy

#### 1. Authentication Flow
```javascript
// Frappe login endpoint
const login = async (username, password) => {
  const response = await fetch(`${FRAPPE_URL}/api/method/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usr: username,
      pwd: password
    })
  });
  
  // Store session cookies or tokens
  const cookies = response.headers.get('set-cookie');
  // Handle cookie storage for subsequent requests
};
```

#### 2. API Request Wrapper
```javascript
class FrappeAPI {
  constructor(baseURL, credentials) {
    this.baseURL = baseURL;
    this.credentials = credentials;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api/resource/${endpoint}`;
    
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.credentials.token}`,
        ...options.headers
      }
    });
  }

  // CRUD operations
  async get(doctype, name = null) {
    const endpoint = name ? `${doctype}/${name}` : doctype;
    return this.request(endpoint);
  }

  async create(doctype, data) {
    return this.request(doctype, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async update(doctype, name, data) {
    return this.request(`${doctype}/${name}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
}
```

### State Management with ERPNext Data

#### Using Redux Toolkit (Recommended)
```javascript
// frappeApi.js - RTK Query setup
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const frappeApi = createApi({
  reducerPath: 'frappeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://your-frappe-site.com/api/resource/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Customer', 'Item', 'SalesOrder'],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => 'Customer',
      providesTags: ['Customer'],
    }),
    createSalesOrder: builder.mutation({
      query: (orderData) => ({
        url: 'Sales Order',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['SalesOrder'],
    }),
  }),
});
```

### Real-time Updates with WebSockets

```javascript
// WebSocket connection for real-time updates
import io from 'socket.io-client';

class FrappeRealtime {
  constructor(frappeURL, token) {
    this.socket = io(frappeURL, {
      auth: { token }
    });
    
    this.socket.on('doc_update', (data) => {
      // Handle document updates
      this.handleDocUpdate(data);
    });
  }

  handleDocUpdate(data) {
    // Update local state or Redux store
    store.dispatch(updateDocument(data));
  }

  subscribe(doctype, callback) {
    this.socket.emit('doc_subscribe', doctype);
    this.socket.on(`${doctype}_update`, callback);
  }
}
```

## Alternative Approaches

### 1. Flutter + Frappe
**Advantages:**
- Single codebase for iOS/Android
- Excellent performance
- Rich UI components

**Integration Pattern:**
```dart
// Dio HTTP client for Frappe API
class FrappeService {
  final Dio _dio = Dio();
  
  Future<Response> login(String username, String password) async {
    return await _dio.post(
      '/api/method/login',
      data: {'usr': username, 'pwd': password}
    );
  }
  
  Future<List<dynamic>> getDocuments(String doctype) async {
    final response = await _dio.get('/api/resource/$doctype');
    return response.data['data'];
  }
}
```

### 2. Capacitor + Frappe
**Best for:** Web developers wanting native app packaging
```javascript
// Capacitor with Frappe PWA
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.frappeapp',
  appName: 'Frappe Mobile',
  webDir: 'dist',
  server: {
    url: 'https://your-frappe-site.com',
    cleartext: true
  }
};
```

### 3. Ionic + Frappe
**Hybrid approach** with native-like UI components
```typescript
// Ionic service for Frappe integration
@Injectable({
  providedIn: 'root'
})
export class FrappeProvider {
  constructor(private http: HttpClient) {}
  
  getDocuments(doctype: string): Observable<any> {
    return this.http.get(`/api/resource/${doctype}`);
  }
}
```

## Recommended Development Approach

### Phase 1: Start with PWA
1. Enable Frappe's PWA features
2. Customize the web interface for mobile
3. Test offline capabilities
4. Evaluate if native features are needed

### Phase 2: Native Development (if needed)
1. **Choose React Native if:**
   - Your team has React/JavaScript expertise
   - Need extensive customization
   - Want to reuse web components logic

2. **Choose Flutter if:**
   - Performance is critical
   - Want consistent UI across platforms
   - Team comfortable with Dart

### Development Best Practices

#### Offline-First Architecture
```javascript
// Implement offline storage
import AsyncStorage from '@react-native-async-storage/async-storage';

class OfflineManager {
  static async cacheData(key, data) {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  }
  
  static async getCachedData(key) {
    const cached = await AsyncStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  }
  
  static async syncWithServer() {
    // Implement sync logic for offline changes
  }
}
```

#### Error Handling and Retry Logic
```javascript
const apiWithRetry = async (apiCall, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

This architecture provides a solid foundation for building mobile applications with Frappe/ERPNext. Start with the PWA approach to validate your concept, then move to native development if specific device capabilities are required.