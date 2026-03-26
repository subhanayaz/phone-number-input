import './App.css'
import { useMemo, useState } from 'react'
import { PhoneInput, type PhoneInputState, countries } from 'lightphone-input'

function App() {
  const [latestState, setLatestState] = useState<PhoneInputState | null>(null)

  const helperText = useMemo(() => {
    if (!latestState) return 'Type a phone number'
    return latestState.isValid
      ? `Valid (${latestState.country.iso2})`
      : `Invalid (${latestState.country.iso2})`
  }, [latestState])

  return (
    <div className="page">
      <header className="header">
        <div className="title">lightphone-input</div>
        <div className="subtitle">Local playground</div>
      </header>

      <main className="content">
        <PhoneInput
          label="Phone number"
          placeholder="(555) 123-4567"
          defaultCountry="US"
          // mode="strict"
          format="national"
          helperText={helperText}
          countries={countries}
          onValueChange={setLatestState}
          // showFlag={false}
        />

        <section className="panel">
          <div className="panelTitle">Latest state</div>
          <pre className="panelBody">{JSON.stringify(latestState, null, 2)}</pre>
        </section>
      </main>
    </div>
  )
}

export default App
