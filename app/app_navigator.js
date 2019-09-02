import React from "react";
import { createBottomTabNavigator } from "react-navigation";
import { Icon } from "react-native-elements"
import { InventoriesNavigator } from "./inventories/stack";
import { SearchNavigator } from "./search/stack";
import { EditNavigator } from "./edit/stack";
import { DriveNavigator } from "./drive/stack";
import { BlankScreen } from "./blank/screens/blank";


export const AppNavigator = createBottomTabNavigator(
    {
      Inventories: InventoriesNavigator,
      Search: SearchNavigator,
      Edit: EditNavigator,
      Drive: DriveNavigator,
      Instructions: BlankScreen
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let iconComponent = 'ionicon';
          let iconName;
          if (routeName === 'Inventories') {
            iconName = `ios-folder${!focused ? '' : '-open'}`;
            // Sometimes we want to add badges to some icons. 
            // You can check the implementation below.
          } else if (routeName === 'Search') {
            iconName = `ios-search`;
          } else if (routeName == 'Edit') {
            iconName = `ios-hammer`
          } else if (routeName == 'Drive') {
            iconName = `ios-cloud${focused ? '' : '-outline'}`
          }
          else if (routeName == 'Instructions') {
            iconName = `ios-information-circle${focused ? '' : '-outline'}`
          }
  
          // You can return any component that you like here!
          return <Icon name={iconName} type={iconComponent} size={25} color={tintColor} />;
        },
        /*tabBarLabel: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state
          let text;
          if (routeName == 'CurrInventory') {
            text = 'Inventory'
          } else if (routeName == 'SearchInventory') {
            text = 'Search'
          }
          // You can return any component that you like here!
          return <Text>{text}</Text>
        } */
      }),
    }
  );