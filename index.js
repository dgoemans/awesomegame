/**
 * Created by David on 29-Mar-15.
 */

requirejs.config({
    baseUrl: 'src',
    paths: {
        pixi: '../lib/pixi',
        class: '../lib/js.class.min',
        proton: '../lib/proton.min'
    },

    shim: {
        'class' : {
            exports: 'Class'
        },
        'proton' : {
            exports: 'Proton'
        }

    }
});
