import { createSlice } from "@reduxjs/toolkit";
import { IMAGES } from "../../constants/Images";

export const wishListSlice = createSlice({
    name: "wishList",
    initialState: {
        wishList: [
            {
                id: "0",
                image: IMAGES.item1,
                title: "Hot Creamy Cappuccino Latte Ombe",
                price: "$12.6",
                brand: "Coffee",
                quantity: 1,
            },
            {
                id: "2",
                image: IMAGES.item3,
                title: "Original Latte Ombe Hot Coffee",
                price: "$12.6",
                brand: "Coffee",
                quantity: 1,
            },
        ],
    },
    reducers: {
        addTowishList: (state: any, action: any) => {
            const itemInwishList = state.wishList.find(
                (item: any) => item.id == action.payload.id
            );
            if (itemInwishList) {
                itemInwishList.quantity++;
            } else {
                state.wishList.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromwishList: (state: any, action: any) => {
            const removeFromwishList = state.wishList.filter(
                (item: any) => item.id !== action.payload
            );
            state.wishList = removeFromwishList;
        },
        incrementQuantity: (state: any, action: any) => {
            const itemInwishList = state.wishList.find(
                (item: any) => item.id == action.payload.id
            );
            itemInwishList.quantity++;
        },
        decrementQuantity: (state: any, action: any) => {
            const itemInwishList = state.wishList.find(
                (item: any) => item.id == action.payload.id
            );
            if (itemInwishList.quantity == 1) {
                const removeFromwishList = state.wishList.filter(
                    (item: any) => item.id !== action.payload.id
                );
                state.wishList = removeFromwishList;
            } else {
                itemInwishList.quantity--;
            }
        },
    },
});

export const {
    addTowishList,
    removeFromwishList,
    incrementQuantity,
    decrementQuantity,
} = wishListSlice.actions;

export default wishListSlice.reducer;
