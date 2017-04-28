package org.vaccineimpact.api.security

open class Question(val fieldName: String, val default: String? = null)
{
    protected open fun getLine(): String? = readLine()

    private fun getAnswer(): String?
    {
        print(fieldName)
        if (default != null)
        {
            print(" [$default]")
        }
        print(": ")
        return getLine()
    }

    fun ask(): String
    {
        var answer: String? = null
        while (answer == null)
        {
            answer = getAnswer()
            if (default != null)
            {
                answer = default
            }
            else if (answer.isNullOrEmpty())
            {
                println("'$fieldName' cannot be blank")
            }
        }
        return answer
    }
}

class PasswordQuestion(fieldName: String): Question(fieldName)
{
    override fun getLine(): String?
    {
        return System.console().readPassword().toString()
    }
}