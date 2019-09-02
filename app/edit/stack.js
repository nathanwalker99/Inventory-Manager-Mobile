import { createStackNavigator } from "react-navigation";
import { EditScreen } from "./screens/edit";
import { RestoreItemsScreen } from "./screens/restore";

export const EditNavigator = createStackNavigator(
    {
      EditScreen: EditScreen,
      RestoreItems: RestoreItemsScreen,
    }
  )
  