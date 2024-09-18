import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Registration from "./components/Registration"
import Login from "./components/Login"
import WorkBoard from "./components/WorkBoard"
import App from "./App"
import MyWorkboards from "./components/MyWorkboards"
import PrivateRoute from "./components/PrivateRoute"

function Routes(){
    return(
        <RouterProvider router={appRouter} />
    )
}

  const appRouter=createBrowserRouter([
      {
        path:"/register",
        element:<Registration />
      },

      {
        path:"/login",
        element:<Login />
      },

      {
        path:"/",
        element:(<PrivateRoute><App /></PrivateRoute>)
      },

      {
          path:"/board",
          element:(<PrivateRoute><WorkBoard /></PrivateRoute>)
      },

      {
        path: "/board/my-workboards/:workBoardId",
        element:(<PrivateRoute><MyWorkboards /></PrivateRoute>)
      }
  ])

export default Routes
