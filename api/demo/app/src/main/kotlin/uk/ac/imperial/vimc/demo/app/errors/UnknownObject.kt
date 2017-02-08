package uk.ac.imperial.vimc.demo.app.errors

class UnknownObject(id: Any, typeName: Any) : Exception("Unknown $typeName with id '$id'")