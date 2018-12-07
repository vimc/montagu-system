package org.vaccineimpact.api.models

enum class GAVISupportLevel
{
    NONE,
    WITHOUT,
    WITH,
    HIGH,
    LOW,
    BESTCASE,

    // Only used in legacy data
    HOLD2010,
    BESTMINUS
}