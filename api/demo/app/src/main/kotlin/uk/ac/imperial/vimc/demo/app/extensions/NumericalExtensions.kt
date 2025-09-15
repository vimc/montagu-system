package uk.ac.imperial.vimc.demo.app.extensions

import java.math.BigDecimal

fun Int.clamp(min: Int, max: Int): Int = Math.max(min, Math.min(this, max))

fun Double.toBigDecimal() = BigDecimal(this)