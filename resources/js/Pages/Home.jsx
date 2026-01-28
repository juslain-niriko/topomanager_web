import React from 'react'
import { Head } from '@inertiajs/react'

export default function Home({ message }) {
    return (
        <>
            <Head title="Accueil" />
            <h1>{message}</h1>
        </>
    )
}
