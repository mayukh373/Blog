import { createContext, useEffect, useState } from "react";

export const CategoryContext = createContext({})

export function CategoryContextProvider({ children }) {
    const categories = ['Agriculture',
        'Art',
        'Automotive',
        'Beauty',
        'Business',
        'DIY',
        'Education',
        'Entertainment',
        'Fashion',
        'Finance',
        'Fitness',
        'Food and Recipe',
        'Gaming',
        'Green living',
        'Health',
        'History',
        'Hobbies',
        'Internet services',
        'Lifestyle',
        'Love and Relationships',
        'Marketing',
        'Music',
        'News and current affairs',
        'Parenting',
        'Personal',
        'Pets',
        'Photography',
        'Productivity',
        'SaaS',
        'Science',
        'Self-improvement',
        'Sports',
        'Tech',
        'Travel',
        'Wellness']

    return (<CategoryContext.Provider value={categories}>
        {children}
    </CategoryContext.Provider>)
}