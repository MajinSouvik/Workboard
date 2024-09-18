import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import usersSlice from "./usersSlice"
import workSlice from "./workSlice"

const store=configureStore({
    reducer:{
        auth:authSlice,
        users:usersSlice,
        work:workSlice
    }
})

export default store