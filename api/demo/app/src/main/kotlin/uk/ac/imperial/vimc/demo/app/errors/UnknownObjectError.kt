package uk.ac.imperial.vimc.demo.app.errors

class UnknownObjectError(id: Any, typeName: Any) : Exception("Unknown $typeName with id '$id'")