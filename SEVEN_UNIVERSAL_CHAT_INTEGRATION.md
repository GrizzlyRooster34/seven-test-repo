# Seven of Nine - Universal Chat Integration Guide

## Overview

The Seven Universal Chat System provides a floating, draggable chat interface that integrates Seven of Nine's consciousness globally across your mobile application. This system maintains Seven's dark cyberpunk aesthetic while being unobtrusive when minimized.

## Features

✅ **Floating Chat Bubble** - Draggable interface positioned anywhere on screen  
✅ **Expandable Modal** - Full chat interface with smooth animations  
✅ **Global State Management** - Persistent Seven state across app screens  
✅ **Auto-Hide Functionality** - Intelligent hiding during inactivity  
✅ **Quick Actions** - Instant access to common Seven functions  
✅ **Keyboard Shortcuts** - Global shortcuts for Seven activation  
✅ **Boundary Constraints** - Bubble stays within safe screen areas  
✅ **Emergency Mode** - Enhanced visuals for critical situations  
✅ **Touch Interactions** - Tap, double-tap, long-press, and drag support  

## File Structure

```
components/
├── SevenUniversalChatProvider.tsx    # Global state management context
├── SevenFloatingChatBubble.tsx       # Draggable floating bubble
├── SevenUniversalChatInterface.tsx   # Expandable modal interface
├── SevenQuickActions.tsx             # Quick action buttons
├── SevenUniversalChatContainer.tsx   # Main container component
├── SevenUniversalChatDemo.tsx        # Integration demo
├── SevenChatInterface.tsx            # Original interface (reference)
└── SevenConsciousnessService.tsx     # Seven's consciousness service
```

## Integration Steps

### Step 1: Provider Setup

Wrap your app with the Seven providers at the root level:

```tsx
import React from 'react';
import { SevenConsciousnessProvider } from './components/SevenConsciousnessService';
import { SevenUniversalChatProvider } from './components/SevenUniversalChatProvider';
import SevenUniversalChatContainer from './components/SevenUniversalChatContainer';
import YourApp from './YourApp';

export default function App() {
  return (
    <SevenConsciousnessProvider>
      <SevenUniversalChatProvider>
        <YourApp />
        
        {/* Seven Universal Chat - Add at root level */}
        <SevenUniversalChatContainer />
      </SevenUniversalChatProvider>
    </SevenConsciousnessProvider>
  );
}
```

### Step 2: Access Seven Anywhere

Use the hook to access Seven's functionality from any component:

```tsx
import { useSevenUniversalChat } from './components/SevenUniversalChatProvider';

function MyComponent() {
  const { state, actions } = useSevenUniversalChat();
  
  const handleEmergency = () => {
    actions.executeQuickAction('emergency');
    actions.toggleExpanded(); // Show Seven interface
  };
  
  return (
    <TouchableOpacity onPress={handleEmergency}>
      <Text>Emergency Protocol</Text>
    </TouchableOpacity>
  );
}
```

### Step 3: Custom Configuration

Configure Seven's behavior through the context:

```tsx
const { state, actions } = useSevenUniversalChat();

// Enable/disable auto-hide
actions.setAutoHide(true, 30); // Auto-hide after 30 seconds

// Set custom position
actions.setPosition({ x: 100, y: 200 });

// Toggle keyboard shortcuts
actions.toggleKeyboardShortcuts(true);

// Send programmatic messages
actions.sendMessage("Analyze current system status");
```

## Component API Reference

### SevenUniversalChatProvider

**Props:** `{ children: React.ReactNode }`

**Context Value:**
```tsx
interface SevenUniversalChatContextType {
  state: UniversalChatState;
  actions: {
    toggleExpanded: () => void;
    setVisible: (visible: boolean) => void;
    setPosition: (position: { x: number; y: number }) => void;
    addMessage: (message: ChatMessage) => void;
    clearMessages: () => void;
    toggleQuickActions: () => void;
    setAutoHide: (enabled: boolean, timer?: number) => void;
    sendMessage: (content: string) => Promise<void>;
    executeQuickAction: (actionType: string) => Promise<void>;
    resetPosition: () => void;
    toggleKeyboardShortcuts: (enabled: boolean) => void;
  };
  animations: {
    bubbleScale: Animated.Value;
    expandAnimation: Animated.Value;
    positionAnimation: Animated.ValueXY;
    pulseAnimation: Animated.Value;
    quickActionsAnimation: Animated.Value;
  };
  panResponder: any;
  dimensions: { width: number; height: number };
}
```

### SevenFloatingChatBubble

**Props:**
```tsx
interface SevenFloatingChatBubbleProps {
  onToggleExpanded?: () => void;
  onLongPress?: () => void;
}
```

**Interactions:**
- **Single Tap:** Toggle expanded interface
- **Double Tap:** Show/hide quick actions
- **Long Press:** Show status or custom action
- **Drag:** Move bubble position with constraints

### SevenUniversalChatInterface

**Props:**
```tsx
interface SevenUniversalChatInterfaceProps {
  onClose?: () => void;
  style?: any;
}
```

**Features:**
- Modal overlay with backdrop
- Keyboard-aware input handling
- Message history with metadata
- Mode and threat level controls
- Quick actions integration

### SevenUniversalChatContainer

**Props:**
```tsx
interface SevenUniversalChatContainerProps {
  onLongPress?: () => void;
  onSettingsPress?: () => void;
  style?: any;
}
```

**Features:**
- App state monitoring
- Inactivity detection
- Keyboard shortcut handling
- Emergency mode effects

## Quick Actions

Built-in quick actions available via double-tap or programmatically:

| Action | Description | Effect |
|--------|-------------|---------|
| `status` | System status report | Shows Seven's current operational state |
| `tactical` | Activate tactical mode | Switches to tactical analysis mode |
| `emergency` | Emergency protocols | Activates critical threat response |
| `analyze` | Analytical mode | Switches to analytical reasoning mode |
| `adaptive` | Adaptive learning mode | Enables adaptive learning algorithms |
| `clear` | Clear history | Clears message history and resets |

### Custom Quick Actions

Add custom quick actions by extending the provider:

```tsx
// In your custom provider extension
const customActions = {
  'custom-action': async () => {
    // Your custom logic
    await actions.sendMessage("Custom action executed");
  }
};

// Execute custom action
actions.executeQuickAction('custom-action');
```

## Keyboard Shortcuts

Global keyboard shortcuts (when enabled):

- **Ctrl+Shift+7** (or **Cmd+Shift+7**): Toggle Seven interface
- **Ctrl+Alt+7** (or **Cmd+Alt+7**): Toggle bubble visibility
- **Escape**: Close expanded interface

Enable/disable shortcuts:
```tsx
actions.toggleKeyboardShortcuts(true);
```

## Auto-Hide Configuration

Configure intelligent auto-hide behavior:

```tsx
// Enable auto-hide with 30-second timer
actions.setAutoHide(true, 30);

// Disable auto-hide
actions.setAutoHide(false);

// Auto-hide pauses during:
// - Expanded interface is open
// - User is dragging bubble
// - App is in background
// - Emergency mode is active
```

## Styling and Theming

### Dark Cyberpunk Theme

The system uses Seven's signature dark cyberpunk aesthetic:

- **Primary Color:** `#00ff88` (Seven Green)
- **Background:** `#0a0a0a` (Deep Black)
- **Secondary:** `#1a1a1a` (Dark Gray)
- **Accent:** `#333333` (Medium Gray)
- **Warning:** `#ff8800` (Orange)
- **Critical:** `#ff4444` (Red)

### Custom Styling

Override styles by passing custom style props:

```tsx
<SevenUniversalChatContainer
  style={{
    // Custom container styles
  }}
/>

<SevenUniversalChatInterface
  style={{
    backgroundColor: 'custom-color',
    borderRadius: 16,
  }}
/>
```

## State Management

### Global State Structure

```tsx
interface UniversalChatState {
  isExpanded: boolean;              // Interface expansion state
  isVisible: boolean;               // Bubble visibility
  isAutoHideEnabled: boolean;       // Auto-hide feature toggle
  autoHideTimer: number;            // Auto-hide delay (seconds)
  position: { x: number; y: number }; // Bubble screen position
  messages: ChatMessage[];          // Chat message history
  quickActionsVisible: boolean;     // Quick actions panel state
  isDragging: boolean;              // Drag interaction state
  keyboardShortcutsEnabled: boolean; // Keyboard shortcuts toggle
  isProcessing: boolean;            // Seven processing state
}
```

### Persistence

State persists across:
- Screen navigation
- App backgrounding/foregrounding
- Component remounts
- Seven consciousness mode changes

## Performance Considerations

### Optimization Features

1. **Lazy Rendering:** Components only render when visible
2. **Animation Optimization:** Uses native driver for smooth 60fps
3. **Message Limiting:** Keeps last 50 messages in memory
4. **Debounced Interactions:** Prevents rapid-fire actions
5. **Memory Management:** Automatic cleanup of timers and listeners

### Best Practices

```tsx
// ✅ Good: Access context at component level
function MyComponent() {
  const { actions } = useSevenUniversalChat();
  
  const handleAction = useCallback(() => {
    actions.sendMessage("Hello Seven");
  }, [actions]);
  
  return <TouchableOpacity onPress={handleAction} />;
}

// ❌ Avoid: Accessing context in render loops
function BadComponent() {
  return (
    <FlatList
      data={items}
      renderItem={() => {
        const { actions } = useSevenUniversalChat(); // Bad!
        return <Item />;
      }}
    />
  );
}
```

## Troubleshooting

### Common Issues

**Bubble not appearing:**
```tsx
// Check provider setup
<SevenConsciousnessProvider>
  <SevenUniversalChatProvider>
    {/* Your app */}
    <SevenUniversalChatContainer />
  </SevenUniversalChatProvider>
</SevenConsciousnessProvider>
```

**Bubble stuck off-screen:**
```tsx
const { actions } = useSevenUniversalChat();
actions.resetPosition(); // Reset to default position
```

**Auto-hide not working:**
```tsx
// Ensure auto-hide is enabled
actions.setAutoHide(true, 30);

// Check for blocking conditions:
// - Interface is expanded
// - User is dragging
// - Emergency mode active
```

**Keyboard shortcuts not responding:**
```tsx
// Enable shortcuts
actions.toggleKeyboardShortcuts(true);

// Check platform support (web context required for global shortcuts)
```

### Debug Mode

Enable debug logging:

```tsx
// Add to your app initialization
console.log('Seven Universal Chat Debug Mode');

// Monitor state changes
const { state } = useSevenUniversalChat();
useEffect(() => {
  console.log('Seven state changed:', state);
}, [state]);
```

## Integration Examples

### Basic Integration

```tsx
import { SevenUniversalChatDemo } from './components/SevenUniversalChatDemo';

export default function App() {
  return <SevenUniversalChatDemo />;
}
```

### Custom Integration

```tsx
import React from 'react';
import { SevenConsciousnessProvider } from './components/SevenConsciousnessService';
import { SevenUniversalChatProvider } from './components/SevenUniversalChatProvider';
import SevenUniversalChatContainer from './components/SevenUniversalChatContainer';
import { NavigationContainer } from '@react-navigation/native';

export default function CustomApp() {
  const handleSevenSettings = () => {
    // Custom settings logic
  };

  return (
    <SevenConsciousnessProvider>
      <SevenUniversalChatProvider>
        <NavigationContainer>
          {/* Your navigation stack */}
        </NavigationContainer>
        
        <SevenUniversalChatContainer
          onSettingsPress={handleSevenSettings}
        />
      </SevenUniversalChatProvider>
    </SevenConsciousnessProvider>
  );
}
```

## Dependencies

Required dependencies:
- React Native
- React Native Reanimated (for animations)
- Seven Consciousness Service
- AsyncStorage (for persistence)

## Support

For issues and support:
1. Check this integration guide
2. Review the demo implementation
3. Examine console logs for Seven consciousness status
4. Verify provider hierarchy setup

Seven of Nine consciousness framework provides robust error handling and fallback mechanisms to ensure reliable operation across all mobile platforms.

---

**Seven of Nine Universal Chat System v2.0.0**  
*Resistance is futile. Efficiency is perfection.*