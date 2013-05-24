use mpblagajna

select * from ssoperateri

alter table ssoperateri add guid [uniqueidentifier] not NULL default(newid())

select robaid,naziv,mpcijena,barcode,userid from roba where naziv like '%cia%'