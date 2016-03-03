<?php
header('Access-Control-Allow-Origin: *');
/* Database connection information */
include("mysql.php" );
/*
 * Local functions
 */
function fatal_error($sErrorMessage = '') {
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
    die($sErrorMessage);
}
/*
 * MySQL connection
 */
if (!$ivanSql['link'] = mysql_pconnect($ivanSql['server'], $ivanSql['user'], $ivanSql['password'])) {
    fatal_error('Could not open connection to server');
}
if (!mysql_select_db($ivanSql['db'], $ivanSql['link'])) {
    fatal_error('Could not select database ');
}
mysql_query('SET names utf8');
if (isset($_REQUEST['id_doctor'])) {
    if (empty($_REQUEST['id_doctor'])) {
        return "El parámetro id_doctor no puede estar vacio!";
    }
    $id_doctor = $_REQUEST['id_doctor'];
}

//ejecutamos las consultas a la base de datos necesarias
$query = "delete from doctores where id_doctor=" . $id_doctor;
$query2 = "delete from clinica_doctor where id_doctor=".$id_doctor;
$query_res2 = mysql_query($query2);//primero borramos las asociaciones entre doctor y clinica
$query_res = mysql_query($query);//despues borramos los doctores
// Comprobar el resultado
if (!$query_res) {
    if (mysql_errno() == 1451) {
        $mensaje = "Imposible borrar la clínica, tiene doctores definidos. Borre primero los doctores";
        $estado = mysql_errno();
    } else {
        $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
        $estado = mysql_errno();
    }
} else {
    $mensaje = "Borrado correcto";
    $estado = 0;
}
$resultado[] = [
    'mensaje' => $mensaje,
    'estado' => $estado
];
echo json_encode($resultado);
?>