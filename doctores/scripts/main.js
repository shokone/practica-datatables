'use strict';
var idDoctor;
$(document).ready(function() {
    var tabla = $('#tabla').DataTable({
        //'ajax': 'php/cargar_vista.php',
        'ajax': 'http://localhost/doctores/php/cargar_vista.php',
        'paging': true,
        'searching': true,
        'processing': true,
        'serverSide': true,
        'language': {
            'sProcessing': 'Procesando...',
            'sLengthMenu': 'Mostrar _MENU_ registros',
            'sZeroRecords': 'No se encontraron resultados',
            'sEmptyTable': 'Ningún dato disponible en esta tabla',
            'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
            'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
            'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
            'sInfoPostFix': '',
            'sSearch': 'Buscar:',
            'sUrl': '',
            'sInfoThousands': ',',
            'sLoadingRecords': 'Cargando...',
            'oPaginate': {
                'sFirst': 'Primero',
                'sLast': 'Último',
                'sNext': 'Siguiente',
                'sPrevious': 'Anterior'
            },
            'oAria': {
                'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                'sSortDescending': ': Activar para ordenar la columna de manera descendente'
            }
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
                    return '<a class="btn btn-primary editarbtn" href=http://localhost/doctores/php/edit_doctor.php?id_doctor=' + data + '>Editar</a>';
                }
            }, {
                'data': 'idDoctor',
                'render': function(data) {
                    return '<a class="btn btn-warning borrarbtn" href=http://localhost/doctores/php/borrar_doctor.php?id_doctor=' + data + '>Borrar</a>';
                }
            }
        ]
    });
    //editar
    $('#tabla').on('click', '.editarbtn', function(e) {
        e.preventDefault();

        $('#tabla').fadeOut(100); //oculta tabla (los row del html)
        $('#formulario').fadeIn(100); //muestra formulario (los row del html)

        var nRow = $(this).parents('tr')[0];
        var aData = tabla.row(nRow).data();
        $('#idDoctor').val(aData.idDoctor);
        $('#nombre').val(aData.nombre);
        $('#numcolegiado').val(aData.numcolegiado);
        $('#clinicas').val(aData.clinicas);
    });

    //borrar
    $('#tabla').on('click', '.borrarbtn', function(e) {
        e.preventDefault();
        var nRow = $(this).parents('tr')[0];
        var aData = tabla.row(nRow).data();
        idDoctor = aData.idDoctor;
        $.ajax({
                type: 'POST',
                dataType: 'json',
                //url: 'php/borrar_doctor.php',
                url: 'http://localhost/doctores/php/borrar_doctor.php',
                data: {
                    id_doctor: idDoctor
                },
                error: function(xhr, status, error) {
                    alert("error al borrar el doctor");
                },
                success: function(data) {
                    var $tabla = $("#tabla").dataTable({
                        bRetrieve: true
                    });
                    $tabla.fnDraw();
                },
                complete: {}
            })
            .done(function() {
                var $tabla = $('#tabla').dataTable({
                    bRetrieve: true
                });
                $tabla.fnDraw();
                console.log('Se ha borrado el doctor');
            })
            .fail(function() {
                console.log('error al borrar el doctor');
            });
    });

    //boton enviar del form editar
    $('#enviar').click(function(e) {
        e.preventDefault();
        var idDoctor = $('#idDoctor').val();
        var nombre = $('#nombre').val();
        var numcolegiado = $('#numcolegiado').val();
        var clinicas = $('#clinicas').val();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            //url: 'php/edit_doctores.php',
            url: 'http://localhost/doctores/php/edit_doctor.php',

            data: {
                id_doctor: idDoctor,
                nombre: nombre,
                numcolegiado: numcolegiado,
                clinicas: clinicas
            },
            error: function(xhr, status, error) {
                alert("Error al enviar el formulario editar");
            },
            success: function(data) {
                var $tabla = $('#tabla').dataTable({
                    bRetrieve: true
                });
                $tabla.fnDraw();
            },
            complete: {}
        });
        $('#tabla').fadeIn(100);
        $('#formulario').fadeOut(100);
        $('#formularioCrear').fadeOut(100);
        location.reload();
    });

    //añadir doctor
    $('#newdoctor').click(function(e) {
        e.preventDefault();

        //oculto tabla muestro form
        $('#tabla').fadeOut(100);
        $('#formularioCrear').fadeIn(100);
        cargarClinicaCrear();
    });

    function cargarClinicas() {
        $.ajax({
            type: 'POST',
            dataType: 'json',
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

        //oculto tabla muestro form
        $('#tabla').fadeOut(100);
        $('#formularioCrear').fadeIn(100);
    });
    //  Este es el script para cargar las clinicas en el formulario
    function cargarClinicaCrear() {
        $.ajax({
            type: 'POST',
            dataType: 'json',
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
    // Este script envia los datos al php para crear el doctor
    $('#enviarDoc').click(function(e) {
        e.preventDefault();
        var nombreNuevo = $('#nombreNuevo').val();
        var numcolegiadoNuevo = $('#numcolegiadoNuevo').val();
        var clinicas_n = $('#clinicas_n').val();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            //url: 'php/crear_doctor.php',
            url: 'http://localhost/doctores/php/crear_doctor.php',
            data: {
                nombreNuevo: nombreNuevo,
                numcolegiadoNuevo: numcolegiadoNuevo,
                clinicas_n: clinicas_n
            },
            error: function(xhr, status, error) {
                //mostraríamos alguna ventana de alerta con el error
            },
            success: function(data) {
                var $tabla = $('#tabla').dataTable({
                    bRetrieve: true
                });
                $tabla.fnDraw();
            },
            complete: {}
        });
        $('#tabla').fadeIn(100);
        $('#formularioCrear').fadeOut(100);
    });
});
