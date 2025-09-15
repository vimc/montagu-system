package org.vaccineimpact.api.models

enum class GAVISupportLevel
{
    NONE,
    WITHOUT,
    WITH,
    HIGH,
    LOW,
    BESTCASE,
    STATUS_QUO,
    CONTINUE,
    GAVI_OPTIMISTIC,
    INTENSIFIED,

    // Only used in legacy data
    HOLD2010,
    BESTMINUS
}