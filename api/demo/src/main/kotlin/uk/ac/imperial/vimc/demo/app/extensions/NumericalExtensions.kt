package uk.ac.imperial.vimc.demo.app.extensions

fun Int.clamp(min: Int, max: Int): Int = Math.max(min, Math.min(this, max))