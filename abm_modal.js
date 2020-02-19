/* global app */

"use strict";

$(function () {
    var $modales = $("div.modal.abm");
    var $modales_form = $modales.find("form");

    $modales.on('show.bs.modal', function (event) {
        var $trigger = $(event.relatedTarget); // Button that triggered the modal
        var $modal = $(this);
        var $form = $modal.find("form");
        var model = $trigger.data();

        $modal.find('.modal-title').text($trigger.data("title")); //completo el titulo
        $form[0].reset();  //limpio el form
        $form.attr("action", $form.data("action"));  //restauro la action original
        var accionAbm = model.accionAbm;

        switch (accionAbm) {
            case "nueva":
            case "nuevo":
            case "alta":    //OK
                $form.attr("action", $form.data("action") + "/" + accionAbm); // =>  /alta
                break;
            case "editar":
            case "modificar":
                $form.view(model);    //relleno form con model
                $form.attr("action", $form.data("action") + "/" + accionAbm + "/" + model.id);  // => /modificar/15
                break;
            default:
                app.ui.mensajeError("Error", "Acción de formulario no definida.");
                break;
        }
    });

    $modales.on('shown.bs.modal', function (event) {
        $(this).find(".focus").focus();
    });

    $modales_form.on('ajax:before', function (event) {
        //$form.find('.spinner').show()
    });

    $modales_form.on('ajax:success', function (event, data, status, xhr) {
        app.ui.recargarPantalla();
    });

    $modales_form.on('ajax:error', function (event, xhr, status, error) {
        if (xhr.status !== 400) {
            return;
        }

        app.ui.resetFormValidation($(this));
        app.ui.fillFormErrors($(this), app.ajax.getRespuesta(xhr));
    });

    $modales_form.on('ajax:complete', function (event, data, status, xhr) {
        //$(this).find('.spinner').hide();
    });
});
