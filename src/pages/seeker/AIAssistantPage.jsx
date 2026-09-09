import React, {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Send,
  Loader,
  Bot,
  User,
} from 'lucide-react'

import {
  Card,
  Button,
} from '../../components/common'

export const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text:
        "Hello! I'm your AI Career Assistant. I can help you with resume tips, interview preparation, job search strategies, and career guidance. What would you like to know?",
    },
  ])

  const [inputValue, setInputValue] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(false)

  const messagesEndRef =
    useRef(null)

  /**
   * Automatically scroll to latest message.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  const suggestedPrompts = [
    'How can I improve my resume?',
    'What skills should I learn for a MERN developer job?',
    'How should I prepare for a React interview?',
    'Give me a roadmap to become a full stack developer',
  ]

  /**
   * Send message with STREAMING response.
   */
  const handleSendMessage = async (
    text = inputValue
  ) => {
    if (
      !text.trim() ||
      isLoading
    ) {
      return
    }

    const userText = text.trim()

    /**
     * Add user message.
     */
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: userText,
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
    ])

    setInputValue('')
    setIsLoading(true)

    /**
     * Temporary AI message.
     *
     * We will update this message
     * chunk-by-chunk.
     */
    const aiMessageId =
      Date.now() + 1

    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        type: 'ai',
        text: '',
      },
    ])

    try {
      const token =
        localStorage.getItem('token')

      if (!token) {
        throw new Error(
          'Authentication token not found. Please login again.'
        )
      }

      /**
       * Streaming request.
       */
      const response = await fetch(
        '/api/ai/chat/stream',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: userText,
          }),
        }
      )

      /**
       * Handle HTTP errors.
       */
      if (!response.ok) {
        let errorText =
          'AI chat request failed.'

        try {
          const errorData =
            await response.json()

          errorText =
            errorData?.message ||
            errorText
        } catch {
          // Ignore JSON parse error.
        }

        throw new Error(
          errorText
        )
      }

      /**
       * Browser streaming support.
       */
      if (!response.body) {
        throw new Error(
          'Streaming is not supported by this browser.'
        )
      }

      const reader =
        response.body.getReader()

      const decoder =
        new TextDecoder(
          'utf-8'
        )

      let fullText = ''

      /**
       * Read chunks continuously.
       */
      while (true) {
        const {
          value,
          done,
        } =
          await reader.read()

        if (done) {
          break
        }

        const chunk =
          decoder.decode(
            value,
            {
              stream: true,
            }
          )

        fullText += chunk

        /**
         * Update AI message immediately.
         */
        setMessages((prev) =>
          prev.map(
            (message) =>
              message.id ===
              aiMessageId
                ? {
                    ...message,
                    text: fullText,
                  }
                : message
          )
        )
      }

      /**
       * Flush decoder.
       */
      const remaining =
        decoder.decode()

      if (remaining) {
        fullText += remaining

        setMessages((prev) =>
          prev.map(
            (message) =>
              message.id ===
              aiMessageId
                ? {
                    ...message,
                    text: fullText,
                  }
                : message
          )
        )
      }

      /**
       * Empty response fallback.
       */
      if (!fullText.trim()) {
        setMessages((prev) =>
          prev.map(
            (message) =>
              message.id ===
              aiMessageId
                ? {
                    ...message,
                    text:
                      'Sorry, I could not generate a response.',
                  }
                : message
          )
        )
      }
    } catch (error) {
      console.error(
        'AI Chat Error:',
        error
      )

      let errorMessage =
        'Sorry, I could not connect to the AI service.'

      if (
        error.message?.includes(
          'Authentication'
        )
      ) {
        errorMessage =
          'Your session has expired. Please login again.'
      } else if (
        error.message
      ) {
        errorMessage =
          error.message
      }

      /**
       * Replace temporary AI message
       * with error.
       */
      setMessages((prev) =>
        prev.map(
          (message) =>
            message.id ===
            aiMessageId
              ? {
                  ...message,
                  text: errorMessage,
                }
              : message
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Enter key support.
   */
  const handleKeyDown = (e) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault()

      handleSendMessage()
    }
  }

  return (
    <div className="space-y-6 flex flex-col">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI Career Assistant
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          Get personalized career guidance powered by AI
        </p>
      </div>

      {/* Chat Card */}
      <Card
        className="flex flex-col"
        style={{
          minHeight: '520px',
        }}
      >

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto space-y-5 mb-4 p-4"
          style={{
            minHeight: '300px',
            maxHeight: '420px',
          }}
        >

          {messages.map(
            (message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type ===
                  'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >

                {/* AI Avatar */}
                {message.type ===
                  'ai' && (
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                )}

                {/* Message */}
                <div
                  className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-xl ${
                    message.type ===
                    'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  {message.text ? (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.text}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin text-primary-600" />

                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        AI is thinking...
                      </span>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {message.type ===
                  'user' && (
                  <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}

              </div>
            )
          )}

          <div
            ref={messagesEndRef}
          />

        </div>

        {/* Suggested Prompts */}
        {messages.length ===
          1 && (
          <div className="mb-4 p-4 border-t border-gray-200 dark:border-gray-700">

            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Try asking:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

              {suggestedPrompts.map(
                (
                  prompt,
                  index
                ) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleSendMessage(
                        prompt
                      )
                    }
                    disabled={
                      isLoading
                    }
                    className="text-left p-3 text-sm text-primary-600 dark:text-primary-400 border border-gray-200 dark:border-gray-600 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-lg transition disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                )
              )}

            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">

          <input
            type="text"
            value={inputValue}
            onChange={(e) =>
              setInputValue(
                e.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder="Ask me anything about your career..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />

          <Button
            variant="primary"
            onClick={() =>
              handleSendMessage()
            }
            disabled={
              !inputValue.trim() ||
              isLoading
            }
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>

        </div>

      </Card>
    </div>
  )
}

export default AIAssistantPage