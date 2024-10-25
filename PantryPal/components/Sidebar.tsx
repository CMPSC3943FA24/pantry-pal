import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0)); // Animation value for sidebar expansion

  // Toggle sidebar expansion
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Interpolate width of sidebar based on animation value
  const sidebarWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['20%', '80%'], // Adjust widths as necessary
  });

  return (
    <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
      {/* Sidebar icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <FontAwesome5 name="cheese" size={24} color="white" />
          <Text style={styles.iconText}>Dairy</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="carrot" size={24} color="white" />
          <Text style={styles.iconText}>Vegetables</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="drumstick-bite" size={24} color="white" />
          <Text style={styles.iconText}>Meats</Text>
        </TouchableOpacity>
      </View>

      {/* Expanded filter options */}
      {isExpanded && (
        <View style={styles.expandedOptions}>
          <TouchableOpacity>
            <Text style={styles.filterText}>Expiring Soon</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.filterText}>Running Low</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Toggle button */}
      <TouchableOpacity onPress={toggleSidebar} style={styles.toggleButton}>
        <Text style={styles.toggleText}>{isExpanded ? 'Collapse' : 'Expand'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    marginTop: 5,
  },
  expandedOptions: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  filterText: {
    color: 'white',
    marginVertical: 10,
  },
  toggleButton: {
    position: 'absolute',
    right: -30,
    top: '50%',
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 15,
  },
  toggleText: {
    color: 'white',
  },
});

export default Sidebar;