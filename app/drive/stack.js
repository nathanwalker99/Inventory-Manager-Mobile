import { createStackNavigator } from "react-navigation";
import { DriveScreen } from "./screens/drive";
import { DriveInventoriesScreen } from "./screens/driveInventories";
import { DrivePreviewScreen } from "./screens/drivePreview";

export const DriveNavigator = createStackNavigator(
    {
      DriveScreen: DriveScreen,
      DriveInventories: DriveInventoriesScreen,
      DrivePreview: DrivePreviewScreen,
    }
  )