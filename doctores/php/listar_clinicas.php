<?php
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
/*
 * SQL queries
 * Get data to display
 */
$sQuery = "select id_clinica, nombre from clinicas order by nombre";
$rResult = mysql_query($sQuery, $ivanSql['link']) or fatal_error('MySQL Error: ' . mysql_errno());
$resultado = array();
while ($fila = mysql_fetch_array($rResult)) {
    $resultado[] = array(
      'id_clinica' => $fila['id_clinica'],
      'nombre' => $fila['nombre']
   );
}
echo json_encode($resultado);
?>
