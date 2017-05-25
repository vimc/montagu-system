package org.vaccineimpact.api.app.serialization

import org.vaccineimpact.api.db.toDecimalOrNull

class MontaguCSVWriter(writer: java.io.Writer) : com.opencsv.CSVWriter(writer)
{
    @Throws(java.io.IOException::class)
    override fun writeNext(nextLine: Array<String?>?, applyQuotesToAll: Boolean, appendable: Appendable)
    {
        if (nextLine == null)
        {
            return
        }

        for (i in nextLine.indices)
        {
            if (i != 0)
            {
                appendable.append(separator)
            }
            val nextElement = nextLine[i] ?: continue
            writeElement(nextElement, applyQuotesToAll, appendable)
        }

        appendable.append(lineEnd)
        writer.write(appendable.toString())
    }

    private fun writeElement(nextElement: String, applyQuotesToAll: Boolean, appendable: Appendable)
    {
        val stringContainsSpecialCharacters = stringContainsSpecialCharacters(nextElement)
        val shouldQuote = (applyQuotesToAll || isText(nextElement) || stringContainsSpecialCharacters)
                && quotechar != NO_QUOTE_CHARACTER
                && nextElement != org.vaccineimpact.api.app.serialization.MontaguCSVWriter.Companion.NoValue

        if (shouldQuote)
        {
            appendable.append(quotechar)
        }
        if (stringContainsSpecialCharacters)
        {
            processLine(nextElement, appendable)
        }
        else
        {
            appendable.append(nextElement)
        }
        if (shouldQuote)
        {
            appendable.append(quotechar)
        }
    }

    private fun isText(element: String) = element.toDecimalOrNull() == null

    companion object
    {
        val NoValue = "NA"
    }
}