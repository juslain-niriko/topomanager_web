<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('accueil/Accueil', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('dashboard/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
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
});

require __DIR__.'/auth.php';
