<?php
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *"); 

include("mysql.php" );

function fatal_error($sErrorMessage = '') {
  header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
  die($sErrorMessage);
}

//conexión con la base de datos
if (!$ivanSql['link'] = mysql_pconnect($ivanSql['server'], $ivanSql['user'], $ivanSql['password'])) {
  fatal_error('Could not open connection to server');
}
if (!mysql_select_db($ivanSql['db'], $ivanSql['link'])) {
  fatal_error('Could not select database ');
}
mysql_query('SET names utf8');

//realizamos las consultas oportunas
$id_doctor = $_POST["id_doctor"];
$nombre = $_POST["nombre"];
$numcolegiado = $_POST["numcolegiado"];
$clinicas = $_POST["clinicas"];
if($clinicas){
  $query = "DELETE FROM clinica_doctor WHERE id_doctor=" . $id_doctor;
  $query_res = mysql_query($query);
}
for ($i=0;$i<count($clinicas);$i++){
  $queryCD = "INSERT INTO clinica_doctor (id_doctor,id_clinica) VALUES(
    ". $id_doctor . ",
    " . $clinicas[$i] . ")" ;
  $query_res = mysql_query($queryCD);
} 

$query = "UPDATE doctores SET nombre = '" . $nombre . "', numcolegiado = '" . $numcolegiado . "' WHERE id_doctor = " . $id_doctor;
$query_res = mysql_query($query);
// comprobamos el resultado de la consulta
if (!$query_res) {
  $mensaje  = 'Error en la consulta: ' .mysql_error() ."\n";
  $estado = mysql_errno();
}else{
  $mensaje = "Actualización correcta";
  $estado = 0;
}
$resultado = array();
$resultado[] = array(
  'mensaje' => $mensaje,
  'estado' => $estado
  );
echo true;
?>
