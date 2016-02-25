'use strict';
var idDoctor;
$(document).ready(function() {
    //formularo nuevo doctor
    var tabla = $('#tabla').DataTable({
        //'ajax': 'http://ivan.infenlaces.com/doctores/php/cargar_vista.php',
        //'ajax': 'php/cargar_vista.php',
        'ajax': 'http://localhost/doctores/php/cargar_vista.php',
        'paging': true,
        'searching': true,
        'processing': true,
        'serverSide': true,
        'language': {
            "language": {"url": "https://cdn.datatables.net/plug-ins/1.10.10/i18n/Spanish.json"}
        },
        'columns': [{
                'data': 'nombre'
            }, {
                'data': 'numcolegiado'
            }, {
                'data': 'id_clinicas',
            }, {
                'data': 'nombreclinicas',
                'render': function(data) {
                    return '<li>' + data + '</li><br>';
                }
            }, {
                'data': 'idDoctor',
                'render': function(data) {
                    return '<a class="btn btn-primary editarbtn">Editar</a>';
                }
            }, {
                'data': 'idDoctor',
                'render': function(data) {
                    return '<a class="btn btn-warning borrarbtn">Borrar</a>';
                }
        }]
    });

    //editar doctor
    $('#tabla').on('click', '.editarbtn', function(e) {
        e.preventDefault();

        $("#formulario").modal();
        var nRow = $(this).parents('tr')[0];
        var aData = tabla.row(nRow).data();
        $('#idDoctor').val(aData.idDoctor);
        $('#nombre').val(aData.nombre);
        $('#numcolegiado').val(aData.numcolegiado);
        $('#clinicas').val(aData.clinicas);
    });

    //borrar doctor
    $('#tabla').on('click', '.borrarbtn', function(e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = tabla.row(nRow).data();
        console.log("primero "+idDoctor);
        idDoctor = aData.idDoctor;
        console.log("hola "+idDoctor);
        $.ajax({
                type: 'POST',
                dataType: 'json',
                //url: 'http://ivan.infenlaces.com/doctores/php/borrar_doctor.php',
                //url: 'php/borrar_doctor.php',
                url: 'http://localhost/doctores/php/borrar_doctor.php',
                data: {
                    id_doctor: idDoctor,
                },
            })
            .done(function() {
                //si todo ha salido bien confirmamos si queremos borrar el doctor
                var con = confirm("¿Borrar doctor?");
                if(con){
                    var $tabla = $('#tabla').DataTable({
                        bRetrieve: true,
                    });
                    $tabla.draw();
                    $.growl.notice({ message: "El doctor ha sido borrado correctamente." });
                }else{
                    $.growl.error({ message: "Error al borrar el doctor" });
                }
            })
            .fail(function() {
                $.growl.error({ message: "Error al borrar el doctor" });
            });
    });

    //boton enviar del form editar
    $('#enviar').on("click", function(e) {
        e.preventDefault();
        var idDoctor = $('#idDoctor').val();
        var nombre = $('#nombre').val();
        var numcolegiado = $('#numcolegiado').val();
        var clinicas = $('#clinicas').val();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            //url: 'http://ivan.infenlaces.com/doctores/php/edit_doctor.php',
            //url: 'php/edit_doctores.php',
            url: 'http://localhost/doctores/php/edit_doctor.php',
            data: {
                id_doctor: idDoctor,
                nombre: nombre,
                numcolegiado: numcolegiado,
                clinicas: clinicas
            },
            success: function(data) {
                $.growl.notice({ message: "La modificación ha sido un éxito." });
                var $tabla = $('#tabla').DataTable({
                    bRetrieve: true,
                });
                $tabla.draw();
            },
            error: function(xhr, status, error) {
                $.growl.error({ message: "El doctor no ha podido ser editado." });
            },
            complete: {}
        });
        $.modal.close();
    });

    //comprobamos los botones cancelar
    $("#cancelar").on("click", function(e){
        e.preventDefault();
        $.growl.warning({ message: "Cancelada la edición por el usuario." });
        $.modal.close();
    });
    $("#cancelar2").on("click", function(e){
        e.preventDefault();
        $.growl.warning({ message: "Cancelada la creación del doctor por el usuario." });
        $.modal.close();
    });

    //añadir doctor
    $('#newdoctor').click(function(e) {
        e.preventDefault();
        $("#formularioCrear").modal();
        cargarClinicaCrear();
    });

    function cargarClinicas() {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            //url: 'http://ivan.infenlaces.com/doctores/php/listar_clinicas.php',
            //url: 'php/listar_clinicas.php',
            url: 'http://localhost/doctores/php/listar_clinicas.php',
            error: function(xhr, status, error) {
                alert("Error al cargar clinicas");
            },
            success: function(data) {
                $('#id').empty();
                $.each(data, function() {
                    $('#clinicas').append(
                        $('<option></option>').val(this.id_clinica).html(this.nombre)
                    );
                });
            },
            complete: {}
        });
    }

    cargarClinicas();
    $('#creaDoc').click(function(e) {
        e.preventDefault();
    });

    //  Este es el script para cargar las clinicas en el formulario
    function cargarClinicaCrear() {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            //url: 'http://ivan.infenlaces.com/doctores/php/listar_clinicas.php',
            //url: 'php/listar_clinicas.php',
            url: 'http://localhost/doctores/php/listar_clinicas.php',
            error: function(xhr, status, error) {
                alert("Error al cargar las clinicas");
            },
            success: function(data) {
                $('#clinicas_n').empty();
                $.each(data, function() {
                    $('#clinicas_n').append(
                        $('<option ></option>').val(this.id_clinica).html(this.nombre)
                    );
                });

            },
            complete: {}
        });
    }
    cargarClinicaCrear();

    // función para crear un nuevo doctor
    $('#enviarDoc').on("click", function(e) {
        e.preventDefault();
        var nombreNuevo = $('#nombreNuevo').val();
        var numcolegiadoNuevo = $('#numcolegiadoNuevo').val();
        var clinicas_n = $('#clinicas_n').val();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            //url: 'http://ivan.infenlaces.com/doctores/php/crear_doctor.php',
            //url: 'php/crear_doctor.php',
            url: 'http://localhost/doctores/php/crear_doctor.php',
            data: {
                nombreNuevo: nombreNuevo,
                numcolegiadoNuevo: numcolegiadoNuevo,
                clinicas_n: clinicas_n
            },
            success: function(data) {
                var $tabla = $('#tabla').DataTable({
                    bRetrieve: true
                });
                $tabla.draw();
                $.growl.notice({ message: "El doctor se ha creado correctamente." });
            },
            error: function(xhr, status, error) {
                //mostraríamos alguna ventana de alerta con el error
                $.growl.error({ message: "Error. El doctor no ha podido crearse." });
            },
            complete: {}
        });
        $.modal.close();
    });

    //validamos los datos de los formularios
    //formulario editar
    $("#formEditar").validate({
        rules: {
            nombre: {
                required: true,
                lettersonly: true,
            },
            numcolegiado: {
                required: true,
                digits: true,
            },
            clinicas: {
                required: true,
            }
        }
    });
    $("#formCrear").validate({
        rules: {
            nombreNuevo: {
                required: true,
                lettersonly: true,
            },
            numcolegiadoNuevo: {
                required: true,
                digits: true,
            },
            clinicas_n: {
                required: true,
            }
        }
    });
});
