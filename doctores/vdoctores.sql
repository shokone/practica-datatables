CREATE VIEW vdoctores AS 

select doctores.id_doctor, doctores.nombre, doctores.numcolegiado as numcolegiado, 
group_concat(clinicas.id_clinica separator ',') AS id_clinicas, 
concat('<ul><li>', group_concat(clinicas.nombre order by clinicas.nombre ASC separator '</li><li>'), '</li></ul>') AS nombreclinicas 
FROM clinicas join clinica_doctor join doctores 
WHERE
doctores.id_doctor = clinica_doctor.id_doctor 
                                                                                                                                                                                   AND
                                                                                                                                                                                  clinicas.id_clinica = clinica_doctor.id_clinica

GROUP BY
doctores.id_doctor

                                                                                                                                                            
                                                                                                                                                             
