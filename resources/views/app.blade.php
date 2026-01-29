<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="{{ asset('assets/Image/favicon.png') }}" rel="shortcut icon" type="image/png" />
    <link href="{{ asset('assets/styles.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/style_default.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/dist/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/mdi/css/materialdesignicons.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/fontawesome-free-6.6.0-web/css/all.min.css') }}" rel="stylesheet">
    <script src="{{ asset('assets/jquery-3.4.1.min.js') }}"></script>
    @routes
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
    <style>
        .main {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        footer {
            background-color: #ffffff;
            color: #0f3659;
            text-align: center;
            padding: 10px 0;
            box-shadow: inset -1px 0px 13px 0px #e9ecef;
        }


        .header_custom {
            padding: 10px;
            background-color: #ffffff;
            border-radius: 10px;
            border: 0.5px solid rgba(15, 54, 89, 0.14);
            transition: transform 0.7s;
        }

        .header_custom:hover {
            transform: scale(1.01);
            box-shadow: 0px 4px 9px rgba(0, 0, 0, 0.1);
        }

        #active {
            background-color: #5d5fef;
            border-left: 3px solid #ffffff;
            color: #ffffff;
        }

        @media (min-width: 576px) {
            .modal-dialog {
                max-width: 400px;
                margin: 1.75rem auto;
            }
        }
    </style>
</head>
<body>
    @inertia
    <script src="{{ asset('assets/dist/js/bootstrap.bundle.min.js') }}"></script>
</body>
</html>
