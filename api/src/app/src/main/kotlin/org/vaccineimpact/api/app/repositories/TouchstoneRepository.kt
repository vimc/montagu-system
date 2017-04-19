package org.vaccineimpact.api.app.repositories

import org.vaccineimpact.api.models.Touchstone
import java.io.Closeable

interface TouchstoneRepository : Repository
{
    val touchstones: SimpleDataSet<Touchstone, String>
}