package org.vaccineimpact.api.test_helpers

import org.docopt.Docopt

const val usage = """Usage:
    testHelpers createTemplateFromDatabase
    testHelpers restoreDatabaseFromTemplate
"""

fun main(args: Array<String>)
{
    val opts = Docopt(usage).parse(args.toList())
    if (opts["createTemplateFromDatabase"] as Boolean)
    {
        DatabaseCreationHelper.main.createTemplateFromDatabase()
        DatabaseCreationHelper.annex.createTemplateFromDatabase()
    }
    else if (opts["restoreDatabaseFromTemplate"] as Boolean)
    {
        DatabaseCreationHelper.main.restoreDatabaseFromTemplate()
        DatabaseCreationHelper.annex.restoreDatabaseFromTemplate()
    }
}