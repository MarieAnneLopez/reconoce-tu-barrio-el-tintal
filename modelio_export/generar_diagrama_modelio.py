# -*- coding: utf-8 -*-
# Macro Jython 2.7 para Modelio: casos de uso de "Reconoce tu Barrio: El Tintal".
# Antes de ejecutarla, selecciona un paquete en el explorador de modelo.
from org.modelio.api.modelio import Modelio

SISTEMA = u"Reconoce tu Barrio: El Tintal"
CASOS = [
    u"CU-01: Centros Educativos",
    u"CU-02: Escenarios Deportivos",
    u"CU-03: Sistemas de Cámaras de Seguridad",
    u"CU-04: Zonas Verdes",
    u"CU-05: Datos Catastrales",
    u"CU-06: Estado de Calles",
    u"CU-07: Estaciones del Sistema de Transporte",
    u"CU-08: Sitios de Comida",
    u"CU-09: Librerías",
    u"CU-10: Datos sobre Robos",
    u"CU-11: Información o Datos de la Localidad",
    u"CU-12: Centros de Atención Inmediata",
    u"CU-13: Veterinarias",
    u"CU-14: Barberías"
]
modelio = Modelio.getInstance()
session = modelio.getModelingSession()
model = session.getModel()
duenio = selectedElements[0]

tx = session.createTransaction("Casos de uso Vecino")
try:
    paquete = model.createPackage(SISTEMA, duenio)
    actor = model.createActor()
    actor.setName(u"Vecino")
    actor.setOwner(paquete)
    casos = []
    for nombre in CASOS:
        uc = model.createUseCase()
        uc.setName(nombre)
        uc.setOwner(paquete)
        casos.append(uc)
    enlaces = [model.createAssociation(actor, uc, u"") for uc in casos]
    diagrama = model.createUseCaseDiagram(u"Casos de uso", paquete, None)
    tx.commit()
except:
    tx.rollback()
    raise

handle = modelio.getDiagramService().getDiagramHandle(diagrama)
handle.unmask(actor, 100, 350)
for i, uc in enumerate(casos):
    columna, fila = i // 7, i % 7
    handle.unmask(uc, 500 + columna * 330, 40 + fila * 100)
for enlace in enlaces:
    handle.unmask(enlace, 0, 0)
handle.save()
handle.close()
print("Listo: 1 actor, %d casos, %d asociaciones" % (len(casos), len(enlaces)))
