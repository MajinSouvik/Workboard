import {createSlice} from "@reduxjs/toolkit"

const workSlice=createSlice({
    name:"work",

    initialState:{
        work:[]
    },

    reducers:{
        setWork:(state,action)=>{
            state.work=action.payload
        }
    }
})


export const {setWork}=workSlice.actions
export default workSlice.reducer

