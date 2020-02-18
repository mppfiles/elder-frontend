/* global app */

"use strict";

$(function () {
    var $modales = $("div.modal.abm");
    var $modales_form = $modales.find("form");

    $modales.on('show.bs.modal', function (event) {
        var $trigger = $(event.relatedTarget); // Button that triggered the modal
        var $modal = $(this);
        var $form = $modal.find("form");

        $modal.find('.modal-title').text($trigger.data("title")); //completo el titulo
        $form[0].reset();  //limpio el form
        $form.attr("action", $form.data("action"));  //restauro la action original
        var accionAbm = $trigger.data("accionAbm");

        switch (accionAbm) {
            case "alta":    //OK
                $form.attr("action", $form.data("action") + "/" + accionAbm); // =>  /alta
                break;
            case "modificar":
                $form.find(':input').val(function () {  //relleno form con dataset
                    return $trigger[0].dataset[this.id];
                });

                $form.attr("action", $form.data("action") + "/" + accionAbm + "/" + $trigger[0].dataset.id);  // => /modificar/15
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
        app.ui.resetFormValidation($(this));
        //$form.find('.spinner').show()
    });

    $modales_form.on('ajax:success', function (event, data, status, xhr) {
        app.ui.recargarPantalla();
    });

    $modales_form.on('ajax:error', function (event, xhr, status, error) {
        if (xhr.status !== 400) {
            return;
        }
        
        app.ui.fillFormErrors($(this), app.ajax.getRespuesta(xhr));
    });

    $modales_form.on('ajax:complete', function (event, data, status, xhr) {
        //$(this).find('.spinner').hide();
    });
});
