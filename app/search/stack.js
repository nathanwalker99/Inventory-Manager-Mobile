import { createStackNavigator } from "react-navigation";
import { SearchScreen } from "./screens/search";
import { ResultsScreen } from "./screens/results";
import { EditItemScreen } from "./screens/edit";


export const SearchNavigator = createStackNavigator(
    {
      SearchScreen: SearchScreen,
      Results: ResultsScreen,
      EditItem: EditItemScreen
    }
  )