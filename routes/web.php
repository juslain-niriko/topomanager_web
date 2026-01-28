<?php

use Inertia\Inertia;

Route::get('/', function () {
    // return Inertia::render('Home', [
    //     'message' => 'Tay',
    // ]);
    return Inertia::render('dashboard/Dashboard');
});

Route::get('/suivi', function () {
    return Inertia::render('suivie_dossier/Suivi_dossier');
});
Route::get('/mes_dossier', function () {
    return Inertia::render('dossier/Dossier');
});
Route::get('/reproduction', function () {
    return Inertia::render('reproduction/Reproduction');
});
Route::get('/reperage', function () {
    return Inertia::render('cartographie/Cartographie');
});
Route::get('/archive', function () {
    return Inertia::render('archive/Archive');
});
Route::get('/profile', function () {
    return Inertia::render('utilisateur/Profile');
});

