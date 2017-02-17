package uk.ac.imperial.vimc.demo.app.errors

import org.jooq.Table

class MissingRelationBetweenTables(from: Table<*>, to: Table<*>): Exception(
        "Attempted to construct join from ${from.name} to ${to.name}, but there are no keys relating those tables."
)

class AmbigiousRelationBetweenTables(from: Table<*>, to: Table<*>): Exception(
        "Attempted to construct join from ${from.name} to ${to.name}, but there is more than one key relating those tables."
)