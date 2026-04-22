import React from 'react'

export interface Slide {
  title: string
  subtitle: string
  content: (subStep: number) => React.ReactNode
  maxSubSteps?: number
  isPitch?: boolean
}

export const getSlides = (simStats?: { gridEnergy: number; co2Offset: number }): Slide[] => [
  {
    title: "The Solaris Manifesto",
    subtitle: "A Neural Network for Energy Sovereignty",
    isPitch: true,
    content: () => (
      <div className="ppt-layout">
        <div className="content-grid">
          <div className="text-block">
            <p className="outfit" style={{ fontSize: '1.4rem', lineHeight: '1.6', fontWeight: 300 }}>
              SOLARIS is the world's first autonomous energy conductor. 
            </p>
            <p style={{ marginTop: '1.5rem', opacity: 0.7, fontSize: '1.05rem', lineHeight: '1.8' }}>
              We transform passive consumers into active "prosumers" in a global energy neural network. By bridging edge-compute hardware with high-frequency financial protocols, Solaris enables energy to flow with the same speed and transparency as digital data.
            </p>
            <div className="hero-stats">
              <div className="hero-stat-card">
                <span className="val" style={{ color: 'var(--accent-primary)' }}>1:1</span>
                <span className="lbl">Digital Twin Sync</span>
              </div>
              <div className="hero-stat-card">
                <span className="val" style={{ color: 'var(--accent-secondary)' }}>Atomic</span>
                <span className="lbl">P2P Settlement</span>
              </div>
            </div>
          </div>
          <div className="visual-block">
             <div className="ppt-card solution">
                <h4>System Goals</h4>
                <ul>
                   <li>○ Zero-Trust Energy Provenance</li>
                   <li>○ High-Fidelity Infrastructure Sync</li>
                   <li>○ Autonomous Grid Optimization</li>
                   <li>○ Carbon Offset Tokenization</li>
                </ul>
             </div>
          </div>
        </div>
        <div className="narrative-box" style={{ marginTop: '2rem' }}>
          <h5>WHY IT MATTERS</h5>
          <p>By decentralizing energy control, we move from a fragile, centralized monopoly to a resilient, citizen-owned grid. Solaris provides the software "brain" for the solar-powered future.</p>
        </div>
      </div>
    )
  },
  {
    title: "The Human Element",
    subtitle: "A Use Case: Ramesh & Kavita",
    isPitch: true,
    maxSubSteps: 2,
    content: (step) => (
      <div className="ppt-layout">
        <div className="persona-ring-group">
          <div className={`persona-node ${step >= 0 ? 'active' : ''}`} style={{ opacity: step >= 0 ? 1 : 0.3 }}>
            <div className="persona-circle producer">RS</div>
            <span>Ramesh Sharma</span>
            <small>Solar Owner (5kW)</small>
          </div>
          <div style={{ fontSize: '2rem', opacity: 0.2 }}>→</div>
          <div className={`persona-node ${step >= 1 ? 'active' : ''}`} style={{ opacity: step >= 1 ? 1 : 0.3 }}>
            <div className="persona-circle consumer">KP</div>
            <span>Kavita Patel</span>
            <small>Local Tailoring Shop</small>
          </div>
          <div style={{ fontSize: '2rem', opacity: 0.2 }}>→</div>
          <div className={`persona-node ${step >= 2 ? 'active' : ''}`} style={{ opacity: step >= 2 ? 1 : 0.3 }}>
            <div className="persona-circle discom">DB</div>
            <span>DISCOM</span>
            <small>Grid Manager</small>
          </div>
        </div>
        <div className="narrative-box" style={{ marginTop: '2rem' }}>
          {step === 0 && <p>Ramesh produced 8 surplus units. Instead of selling to the DISCOM at ₹3/unit, he lists them at <strong>₹5.50/unit</strong> in the Solaris network.</p>}
          {step === 1 && <p>Kavita needs cheap power for her shop. She buys Ramesh's units via Solaris, saving ₹28 compared to the grid rate of ₹7-9/unit.</p>}
          {step === 2 && <p>Solaris handles the atomic trade, UPI settlement, and grid notify in &lt; 1 second. Ramesh earns, Kavita saves, and DISCOM stabilizes.</p>}
        </div>
      </div>
    )
  },
  {
    title: "P2P Transaction Flow",
    subtitle: "Atomic Real-Time Settlement",
    isPitch: true,
    content: () => (
      <div className="ppt-layout">
        <div className="ppt-table-container">
          <table className="ppt-table">
            <thead>
              <tr><th>STAGE</th><th>ACTION</th><th>PROTOCOL</th></tr>
            </thead>
            <tbody>
              <tr><td>IDENTIFICATION</td><td>Edge nodes signal excess capacity and local ROI targets</td><td>LP-Gossip</td></tr>
              <tr><td>MATCHING</td><td>AMM logic identifies nearest high-need consumer node</td><td>Solaris-DEX</td></tr>
              <tr><td>TRANSFER</td><td>Physical energy routing through grid managed via Smart-Link</td><td>L2-Mesh</td></tr>
              <tr><td>SETTLEMENT</td><td>Instant balance update, CO2 logging, and grid telemetry sync</td><td>Atomic-Sync</td></tr>
            </tbody>
          </table>
        </div>
        <div className="narrative-box" style={{ marginTop: '1.5rem' }}>
           <h5>THE TECHNICAL EDGE</h5>
           <p>Unlike traditional energy markets that settle daily, Solaris settles every 15 seconds. This "High-Frequency Energy Trading" ensures that the grid remains physically and financially balanced in real-time.</p>
        </div>
      </div>
    )
  },
  {
    title: "Hardware Topology",
    subtitle: "ESP32-S3 Nexus Integration",
    isPitch: true,
    content: () => (
      <div className="ppt-layout">
        <div className="content-grid reverse">
          <div className="visual-block">
             <div className="ppt-card" style={{ background: 'var(--ppt-navy)', borderTopColor: 'var(--accent-primary)' }}>
                <h4 style={{ color: '#fff' }}>Nexus Node Specs</h4>
                <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                   <li>○ ADC1_CH0: Solar Ingress (12-bit)</li>
                   <li>○ SPI_DMA_BUF: High-Speed Telemetry</li>
                   <li>○ XTS-AES 256 Encrypted Tunnel</li>
                   <li>○ Wi-Fi 6 / LoRa Multi-Band</li>
                </ul>
             </div>
          </div>
          <div className="text-block">
            <h4 style={{ color: 'var(--ppt-navy)' }}>The physical source of truth</h4>
            <p>Every Solaris node is a cryptographic oracle. By sampling voltage and current at <strong>1000Hz</strong>, we ensure that energy production data cannot be spoofed. This hardware layer is the bedrock of our digital twin's observability.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Grid Economics",
    subtitle: "CPMM: Constant-Product Market Making",
    isPitch: true,
    content: () => (
      <div className="ppt-layout">
        <div className="content-grid">
           <div className="text-block">
              <p className="outfit" style={{ fontSize: '1.3rem' }}>Dynamic Price Discovery</p>
              <p style={{ marginTop: '1rem', opacity: 0.7, lineHeight: '1.7' }}>
                Solaris adapts DeFi liquidity logic to energy. The <strong>x * y = k</strong> formula ensures that the local energy price adjusts dynamically based on solar yield (supply) and appliance load (demand).
              </p>
           </div>
           <div className="visual-block">
              <div className="ppt-card solution">
                 <h4>Price Formula</h4>
                 <div style={{ background: '#000', padding: '1.5rem', borderRadius: '12px', color: 'var(--accent-primary)', fontFamily: 'monospace', fontSize: '1.5rem', textAlign: 'center' }}>
                    P = Δy / Δx
                 </div>
                 <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '1rem', textAlign: 'center' }}>Self-Stabilizing Energy Liquidity</p>
              </div>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "Digital Twin Fabric",
    subtitle: "High-Fidelity R3F Observability",
    isPitch: true,
    content: () => (
      <div className="ppt-layout">
        <div className="ppt-grid-box">
           <div className="ppt-card">
              <h4>1:1 State Sync</h4>
              <p>The Solaris Twin is more than a 3D model; it is a live reflection of the physical grid. Thousands of concurrent energy packets are rendered at <strong>60 FPS</strong> using GPU instancing.</p>
           </div>
           <div className="ppt-card solution">
              <h4>Real-Time ROI</h4>
              <div className="val" style={{ fontSize: '3rem', fontWeight: 900 }}>
                {simStats ? Math.round(simStats.co2Offset) : 0} <small style={{ fontSize: '0.8rem' }}>kg CO2 saved</small>
              </div>
              <p style={{ opacity: 0.6, marginTop: '1rem' }}>Metrics derived from immutable ledger packets across the local mesh.</p>
           </div>
        </div>
      </div>
    )
  },
  {
    title: "Scaling to the Next 40M",
    subtitle: "System Evolution & Submission",
    isPitch: true,
    content: () => (
      <div className="ppt-layout">
        <div className="ppt-grid-box">
          <div className="ppt-card">
            <h4>Semester 1</h4>
            <ul>
                <li>○ Core Platform Architecture</li>
                <li>○ Hardware Prototype finalized</li>
                <li>○ Simulated Mesh with 50+ nodes</li>
            </ul>
          </div>
          <div className="ppt-card solution">
            <h4>Semester 2</h4>
            <ul>
                <li>○ Live Pilot in Indore Tech Park</li>
                <li>○ Blockchain Settlement Audit</li>
                <li>○ PM Surya Ghar Yojana Integration</li>
            </ul>
          </div>
        </div>
        <div className="narrative-box" style={{ marginTop: '2rem' }}>
          <p>Solaris isn't just a project; it's a blueprint for the future of the Indian grid. We are building the infrastructure to empower the next 40 million solar-ready homes in Bharat.</p>
        </div>
      </div>
    )
  }
]
