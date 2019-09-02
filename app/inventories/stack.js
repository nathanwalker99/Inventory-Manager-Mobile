import { createStackNavigator } from "react-navigation";
import { InventoriesScreen } from "./screens/inventories";
import { PreviewScreen } from "./screens/preview";

export const InventoriesNavigator = createStackNavigator(
    {
      InventoryScreen: InventoriesScreen,
      Preview: PreviewScreen
    }
  )