/* global bootbox */

'use strict';
var app = {
    base_url: "",
    locale: "es",

    init: function (opts) {
        var self = this;

        self.base_url = opts.base_url;
        self.locale = opts.locale || "es",
        self.ui.init();
        self.ajax.init();
        $(document).trigger("app.initialized");
    }
};

app.ui = {
    messages: {
        loading: "Por favor espere",
        confirm_title: 'Confirmar acción',
        confirm_commit: 'Continuar',
        confirm_cancel: 'Cancelar'
    },

    init: function () {
        bootbox.setDefaults({locale: app.locale, animate: false});
        $('[data-toggle="tooltip"]').tooltip(); //tooltips de bootstrap
        $('[data-toggle="popover"]').popover(); //popovers de bootstrap
        
        dataConfirmModal.setDefaults({
            title: app.ui.messages.confirm_title,
            commit: app.ui.messages.confirm_commit,
            cancel: app.ui.messages.confirm_cancel,
            fade:   false,
            verifyClass: 'form-control'
        });
    },

    recargarPantalla: function () {
        window.top.location = "";
    },

    mensajeCargando: function () {
        bootbox.dialog({closeButton: false, message: "<p class='text-center lead'><i class='fas fa-lg fa-spinner fa-spin'> </i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + app.ui.messages.loading + "... </p>"});
    },

    mensaje: function (titulo, mensaje, callbackOK) {
        if (callbackOK === undefined) {
            callbackOK = $.noop;
        }
        bootbox.dialog({closeButton: false, title: titulo, message: mensaje, buttons: {"OK": {className: 'btn-default', callback: callbackOK}}});
    },

    mensajeError: function (titulo, mensaje, callbackOK) {
        if (callbackOK === undefined) {
            callbackOK : $.noop;
        }
        bootbox.dialog({closeButton: false, title: titulo, message: mensaje, buttons: {"OK": {className: 'btn-danger', callback: callbackOK}}});
    },

    resetFormValidation: function ($form) {
        $form.removeClass("was-validated");
        $form.find(".is-invalid").removeClass("is-invalid");
        $form.find(".is-valid").removeClass("is-valid");
    },

    fillFormErrors: function ($form, data) {
        var self = this;

        $.each(data, function (key, value) {
            $form.find(":input[name=" + key + "]")
                    .removeClass("is-valid")
                    .addClass("is-invalid")
                    .parent().find(".invalid-feedback").text(value);
        });

        if (data.global !== undefined) {
            self.mensajeError("Error", data.global);
        }
    }
};

app.ajax = {
    messages: {
        access_denied_title: "Acceso denegado",
        access_denied: "Su sesi&oacute;n ha caducado, o no tiene los permisos suficientes para completar esta acci&oacute;n.",
        error_parsing_response_title: "Error de la aplicación",
        error_parsing_response: "No se pudo procesar la respuesta del servidor. Por favor, contacte al área técnica.",
        server_error_title: "Error del servidor",
        server_error: "Ha ocurrido un error. Por favor, contacte al &aacute;rea t&eacute;cnica."
    },

    init: function () {
        var self = this;

        $(document).ajaxError(function (event, xhr, settings, exception) {
            if (exception === 'timeout') {
                alert("Timeout");
            } else if (exception === 'abort') {
                return;
            } else if (xhr.status === 400) {
                //error de validación. Se maneja en forma particular.
                return;
            }

            bootbox.hideAll();

            if (xhr.status === 403) {
                self.mensajeError(app.ajax.messages.access_denied_title, app.ajax.messages.access_denied);
                return;
            }

            //error 500, o cualquier otro error.
            self.mensajeError(app.ajax.messages.server_error_title, app.ajax.messages.server_error);
        });
    },

    getRespuesta: function (data) {
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log(e);
            app.mensajeError(app.ajax.messages.error_parsing_response_title, app.ajax.messages.error_parsing_response);
            data = {"global": app.ajax.messages.error_parsing_response};
        }

        return data;
    }
};
