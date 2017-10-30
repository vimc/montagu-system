package org.vaccineimpact.api.models

object Gender
{
    const val BOTH = "both"

    fun ifApplicable(suppliedGender: String, applicable: Boolean) = if (applicable)
    {
        suppliedGender
    }
    else
    {
        BOTH
    }
}