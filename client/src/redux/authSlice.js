import {createSlice} from "@reduxjs/toolkit"

const authSlice=createSlice({
    name:"auth",

    initialState:{
        auth:localStorage.getItem("access")?{
            "access_token":localStorage.getItem("access"),
            "refresh_token":localStorage.getItem("refresh"),
            "user":{
                "id":localStorage.getItem("id"),
                "username":localStorage.getItem("username"),
                "email":localStorage.getItem("email")
            }
        }:{}
    },

    reducers:{
        login:(state,action)=>{
            state.auth=action.payload
            localStorage.setItem('access', action.payload.access_token);
            localStorage.setItem('refresh', action.payload.refresh_token);
            localStorage.setItem("id", action.payload.user.id);
            localStorage.setItem("username", action.payload.user.username);
            localStorage.setItem("email", action.payload.user.email)
        },

        logout:(state)=>{
            state.auth=null
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('id');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
        },

        refreshAccessToken: (state, action) => {
            console.log("called-->", action.payload)
            state.auth = action.payload;
          },
    }
})


export const {login, logout, refreshAccessToken}=authSlice.actions
export default authSlice.reducer

