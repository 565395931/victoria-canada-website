const heroImage = "./assets/images/home-hero.webp";
const i18n = window.VICTORIA_I18N;
const sourceText = new WeakMap();
const sourceAttributes = new WeakMap();
let currentLanguage = localStorage.getItem("victoria-language") === "zh" ? "zh" : "en";

const t = (text) => currentLanguage === "zh" ? (i18n.zh.strings[text] || text) : text;

function translateTree(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!sourceText.has(node)) sourceText.set(node, node.nodeValue);
    const source = sourceText.get(node);
    const key = source.trim();
    if (!key) continue;
    const replacement = currentLanguage === "zh" ? (i18n.zh.strings[key] || key) : key;
    node.nodeValue = source.replace(key, replacement);
  }

  root.querySelectorAll("[aria-label], [placeholder], [title], [data-label], [alt]").forEach((element) => {
    if (!sourceAttributes.has(element)) {
      const originals = {};
      ["aria-label", "placeholder", "title", "data-label", "alt"].forEach((attribute) => {
        if (element.hasAttribute(attribute)) originals[attribute] = element.getAttribute(attribute);
      });
      sourceAttributes.set(element, originals);
    }
    Object.entries(sourceAttributes.get(element)).forEach(([attribute, source]) => {
      element.setAttribute(attribute, currentLanguage === "zh" ? (i18n.zh.strings[source] || source) : source);
    });
  });
}

function updateLanguageSwitch() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-language]").forEach((button) => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

const serviceItems = [
  ["Sourcing and Supply Chain", "Identify products and potential manufacturers, compare commercial options and coordinate work from a clear sourcing brief."],
  ["Market Entry and Expansion", "Assess market fit, readiness, competitive positioning and the most practical route to market."],
  ["Business Development", "Identify relevant buyers, distributors and project partners, then support introductions and follow-up."],
  ["Local Coordination", "Keep communication, documentation and qualified specialist partners aligned across Canada and China."]
];

const detailList = (items) => items.map(([title, copy]) => `
  <article class="detail-block">
    <h3>${title}</h3>
    <p>${copy}</p>
  </article>
`).join("");

const serviceList = (items) => items.map(([title, copy]) => `
  <article class="service-item">
    <h3>${title}</h3>
    <p>${copy}</p>
  </article>
`).join("");

const pageHero = (title, copy, className = "") => `
  <section class="page-hero ${className} fade-in">
    <div class="page-hero-inner">
      <h1>${title}</h1>
      <p>${copy}</p>
    </div>
  </section>
`;

const cta = (title, label = "Submit Your Request") => `
  <section class="cta-band">
    <h2>${title}</h2>
    <a class="button button-light" href="#/request">${label}</a>
  </section>
`;

const homePage = () => `
  <section class="hero fade-in">
    <img class="hero-media" src="${heroImage}" alt="VICTORIA Canada installation overlooking the Toronto skyline with the CN Tower on the right" width="3344" height="1882" fetchpriority="high" decoding="async" />
    <div class="hero-content">
      <p class="eyebrow">Canada-China Cross-Border Services</p>
      <h1>From Market Opportunity to Commercial Execution</h1>
      <p class="hero-copy">VICTORIA helps Canadian buyers and Chinese manufacturers turn cross-border opportunities into structured, executable projects.</p>
      <div class="button-row">
        <a class="button button-primary" href="#/request">Discuss a Project</a>
        <a class="button button-outline" href="#/about">Discover VICTORIA</a>
      </div>
    </div>
  </section>

  <section class="section audience-section">
    <div class="container">
      <div class="section-heading">
        <h2>Services for Buyers and Manufacturers</h2>
        <p>Practical cross-border support for companies buying from China and manufacturers building a path into Canada.</p>
      </div>
      <div class="audience-grid">
        <article class="audience-panel primary">
          <img class="audience-media" src="./assets/images/audience-canadian.webp" alt="" loading="lazy" decoding="async" aria-hidden="true" />
          <div class="panel-content">
            <h3>For Canadian Buyers</h3>
            <p>Source products, assess potential suppliers and coordinate the path from a commercial brief to import readiness.</p>
            <ul class="audience-services" aria-label="Services for Canadian buyers">
              <li>OEM / ODM</li>
              <li>Factory Capability Review</li>
              <li>Product Development</li>
              <li>Production Coordination</li>
            </ul>
          </div>
          <a class="text-link" href="#/canadian-buyers">Explore Buyer Services</a>
        </article>
        <article class="audience-panel secondary">
          <img class="audience-media" src="./assets/images/audience-manufacturer.webp" alt="" loading="lazy" decoding="async" aria-hidden="true" />
          <div class="panel-content">
            <h3>For Chinese Manufacturers</h3>
            <p>Assess market fit, prepare for Canadian buyers and develop relevant commercial relationships.</p>
            <ul class="audience-services" aria-label="Services for Chinese manufacturers">
              <li>Market Research</li>
              <li>Product &amp; Market Validation</li>
              <li>Buyer &amp; Distributor Development</li>
              <li>Canada-Side Project Coordination</li>
            </ul>
          </div>
          <a class="text-link" href="#/chinese-manufacturers">Explore Market Entry</a>
        </article>
      </div>
    </div>
  </section>

  <section class="section section-soft capabilities-section">
    <div class="container capabilities-layout">
      <div class="capabilities-main">
        <div class="section-heading">
          <h2>Market Insight, Connections and Execution</h2>
          <p>VICTORIA brings market insight, relevant business connections and project follow-through into one working relationship.</p>
        </div>
        <div class="service-list">${serviceList(serviceItems)}</div>
      </div>
      <figure class="capabilities-media">
        <img src="./assets/images/team-coordination.webp" alt="Canadian and Chinese project professionals reviewing technical drawings and a manufactured component" loading="lazy" decoding="async" />
      </figure>
    </div>
  </section>

  <section class="section process-section">
    <div class="container process-wrap">
      <div class="process-intro">
         <h2>A Structured Path from Brief to Execution</h2>
        <p>Each engagement starts with the business need, then moves through evidence, connections and coordinated execution.</p>
        <figure class="process-media">
          <img src="./assets/images/process-worktable.webp" alt="Technical drawings, material samples and precision tools arranged on a project worktable" loading="lazy" decoding="async" />
        </figure>
      </div>
      <div class="process-list">
         <article class="process-step"><h3>Understand</h3><p>Clarify the product, market, budget, timeline and commercial objective.</p></article>
        <article class="process-step"><h3>Assess</h3><p>Review feasibility, risk, market expectations and the resources required.</p></article>
         <article class="process-step"><h3>Connect</h3><p>Identify and engage suitable suppliers, buyers, distributors or qualified professional partners.</p></article>
         <article class="process-step"><h3>Coordinate</h3><p>Manage communication, documentation, milestones and agreed project follow-up.</p></article>
      </div>
    </div>
  </section>

  <section class="statement visual-statement">
    <img class="statement-media" src="./assets/images/statement-bridge.webp" alt="" loading="lazy" decoding="async" aria-hidden="true" />
    <div class="container"><blockquote>Cross-border opportunities become viable when market fit is tested, the right parties are engaged and execution is coordinated locally.</blockquote></div>
  </section>

  <section class="section opportunity-section">
    <div class="container">
      <div class="section-heading">
        <h2>Selected Areas of Opportunity</h2>
        <p>VICTORIA evaluates each request against supplier capability, market fit and project-specific requirements.</p>
      </div>
      <div class="category-grid">
        <article class="category-card"><img class="category-media" src="./assets/images/category-machinery.webp" alt="" loading="lazy" decoding="async" aria-hidden="true" /><h3>Machinery and Industrial Solutions</h3><p>Equipment, components and manufacturing capabilities for commercial and industrial applications.</p></article>
        <article class="category-card"><img class="category-media" src="./assets/images/category-building.webp" alt="" loading="lazy" decoding="async" aria-hidden="true" /><h3>Building and Home Products</h3><p>Products for distributors, contractors, developers and retail programs.</p></article>
        <article class="category-card"><img class="category-media" src="./assets/images/category-electronics.webp" alt="" loading="lazy" decoding="async" aria-hidden="true" /><h3>Electronics and Smart Devices</h3><p>Consumer and commercial products supported by sample and documentation coordination.</p></article>
        <article class="category-card"><img class="category-media" src="./assets/images/category-custom-sourcing.webp" alt="" loading="lazy" decoding="async" aria-hidden="true" /><h3>Custom Sourcing Requests</h3><p>Share a specification, reference image or project brief and we will assess a suitable sourcing path.</p></article>
      </div>
    </div>
  </section>
  ${cta("Discuss Your Next Cross-Border Project")}
`;

const productsPage = () => `
  ${pageHero("Product Sourcing and Market Opportunities", "From defined specifications to OEM, ODM and market-ready products, VICTORIA structures each engagement around a clear commercial objective.")}
  <section class="section product-entry-section">
    <div class="container product-entry-layout">
      <div class="product-entry-intro">
        <h2>Start With the Business Need</h2>
        <p>Begin with the commercial result you need, the market you serve and the constraints that matter.</p>
      </div>
      <div class="product-path-list">
        <article class="product-path">
          <p class="product-path-audience">For Canadian Buyers</p>
          <h3>Source a Defined Product</h3>
          <p>Bring a specification, reference product, target quantity or cost objective. VICTORIA will assess potential sourcing routes and supplier fit.</p>
        </article>
        <article class="product-path">
          <p class="product-path-audience">For Brands and Product Teams</p>
          <h3>Develop or Adapt a Product</h3>
          <p>Explore OEM, ODM, private-label or product modification requirements with manufacturers suited to the project.</p>
        </article>
        <article class="product-path">
          <p class="product-path-audience">For Chinese Manufacturers</p>
          <h3>Prepare an Existing Product for Canada</h3>
          <p>Assess Canadian market fit, buyer expectations and the preparation required before commercial outreach begins.</p>
        </article>
      </div>
      <div class="brief-checks" aria-label="Information to include in an initial product brief">
        <p class="brief-checks-title">A useful initial brief includes</p>
        <div class="brief-checks-grid">
          <span>Product specifications</span>
          <span>Target market</span>
          <span>Quantity and budget</span>
          <span>Timing and delivery needs</span>
        </div>
      </div>
    </div>
  </section>
  <section class="section section-soft products-service-section">
    <div class="container detail-grid">
      <div class="side-title"><h2>A Sourcing Service, Not a Public Catalogue</h2><p class="side-copy">Availability, pricing, lead times, certification and import eligibility are confirmed for each project.</p></div>
      <div>${detailList([
        ["Custom Sourcing", "Send specifications, reference images, target quantity and delivery expectations for an initial sourcing assessment."],
        ["OEM and ODM Coordination", "Explore product adaptation, private-label and custom manufacturing opportunities with suitable suppliers."],
        ["Commercial Comparison", "Compare supplier fit, quoted terms and project considerations before making a commitment."],
        ["Supplier and Buyer Matching", "When there is a credible fit, VICTORIA can coordinate an introduction between suitable manufacturers and Canadian commercial buyers."]
      ])}</div>
    </div>
  </section>
  ${cta("Discuss a Specific Sourcing Requirement")}
`;

const buyersPage = () => `
  ${pageHero("Source from China with Clarity and Control", "VICTORIA supports supplier research, commercial comparison, production coordination and import readiness for Canadian businesses.")}
  <section class="section audience-service-section">
    <div class="container compact-detail-layout">
      <div class="compact-detail-intro">
        <h2>What We Coordinate</h2>
        <p>Canadian importers retain decision control and responsibility for customs, product safety and regulatory compliance. VICTORIA coordinates qualified specialists where needed.</p>
      </div>
      <div class="compact-services-grid">${detailList([
        ["Product and Supplier Research", "Identify potential manufacturers based on specifications, capacity, commercial fit and target cost."],
        ["Capability and Document Review", "Review available business credentials, production capabilities and relevant documentation before commitment."],
        ["Quotation and Sample Coordination", "Organize comparable quotations, samples, revisions and supplier communication."],
        ["Production and Inspection Coordination", "Follow critical milestones and arrange appropriate third-party inspection support when required."],
        ["Freight and Customs Coordination", "Coordinate documentation, freight planning and introductions to qualified customs providers."],
        ["Ongoing Supplier Coordination", "Support communication, issue resolution, repeat orders and supplier performance follow-up."]
      ])}</div>
    </div>
  </section>
  <section class="section section-soft">
    <div class="container process-wrap">
      <div class="process-intro"><h2>A Clearer Sourcing Path</h2><p>You retain decision control while VICTORIA coordinates agreed work between your team and the supply side.</p></div>
      <div class="process-list">
        <article class="process-step"><h3>Define the Brief</h3><p>Product, specification, target cost, quantity, timing and delivery location.</p></article>
        <article class="process-step"><h3>Evaluate Options</h3><p>Supplier shortlist, capability review, quotation comparison and initial risk assessment.</p></article>
        <article class="process-step"><h3>Confirm the Product</h3><p>Sample coordination, revisions, commercial terms and production readiness.</p></article>
        <article class="process-step"><h3>Coordinate Fulfilment</h3><p>Production follow-up, inspection support, documentation, shipping coordination and issue resolution.</p></article>
      </div>
    </div>
  </section>
  ${cta("Discuss Your Sourcing Project", "Start a Sourcing Request")}
`;

const manufacturersPage = () => `
  ${pageHero("Prepare Your Business for the Canadian Market", "Assess demand, strengthen market readiness and develop relevant buyer and distributor relationships in Canada.")}
  <section class="section audience-service-section">
    <div class="container compact-detail-layout">
      <div class="compact-detail-intro"><h2>What Market Readiness Requires</h2><p>Market assessments and introductions do not guarantee certification, market acceptance or sales. They help you make better-informed decisions.</p></div>
      <div class="compact-services-grid">${detailList([
        ["Market Opportunity Assessment", "Evaluate customer segments, competitive positioning, demand signals and realistic entry routes."],
        ["Product Readiness Review", "Identify gaps in documentation, packaging, labelling, certifications and buyer expectations."],
        ["Brand and Sales Localization", "Adapt company profiles, presentations and commercial messages for Canadian audiences."],
        ["Buyer and Distributor Outreach", "Identify and approach relevant importers, wholesalers, distributors and project partners."],
        ["Project-Based Local Coordination", "Maintain local communication and opportunity follow-up without immediately building a full local team."],
        ["Launch and Growth Support", "Coordinate pilot opportunities, commercial feedback, partner communication and channel development."]
      ])}</div>
    </div>
  </section>
  <section class="statement"><div class="container"><blockquote>Entering Canada is not only about shipping a product. It is about becoming ready for Canadian buyers.</blockquote></div></section>
  <section class="section section-soft">
    <div class="container process-wrap">
      <div class="process-intro"><h2>Move Forward With Evidence</h2><p>Each stage answers a practical question before more time and budget are committed.</p></div>
      <div class="process-list">
        <article class="process-step"><h3>Assess Market Fit</h3><p>Clarify the target audience, competition, demand signals and commercial proposition.</p></article>
        <article class="process-step"><h3>Prepare the Offer</h3><p>Align the product, documentation and sales story with Canadian expectations.</p></article>
        <article class="process-step"><h3>Develop the Market</h3><p>Approach suitable buyers, distributors and commercial partners.</p></article>
        <article class="process-step"><h3>Support Local Growth</h3><p>Follow up on credible opportunities and coordinate the next agreed steps.</p></article>
      </div>
    </div>
  </section>
  ${cta("Assess Your Readiness for the Canadian Market", "Request a Market Review")}
`;

const aboutPage = () => `
  <section class="page-hero about-hero fade-in">
    <div class="about-sky" aria-hidden="true">
      <span class="about-orbit"></span>
      <span class="about-streak about-streak-main"></span>
      <span class="about-streak about-streak-soft"></span>
    </div>
    <div class="page-hero-inner">
      <p class="about-eyebrow">About VICTORIA Canada</p>
      <h1>Local Insight<br />Cross-Border Execution</h1>
      <p>VICTORIA combines local market insight, relevant business access and hands-on coordination to move cross-border projects forward.</p>
      <div class="about-hero-signals" aria-label="VICTORIA working principles">
        <span>Local Knowledge</span><span>Practical Access</span><span>Coordinated Execution</span>
      </div>
    </div>
  </section>
  <div class="about-content-flow">
  <section class="section about-story-section">
    <div class="container about-story-layout">
      <div class="about-story-intro">
        <p class="about-section-label">Why VICTORIA Exists</p>
        <h2>Turning cross-border potential into workable business.</h2>
        <p>Good opportunities still need local context, clear communication and disciplined follow-through to become workable business.</p>
      </div>
      <div class="about-value-grid">
        <article class="about-value-card"><h3>From Opportunity to Execution</h3><p>Strong products and genuine demand do not automatically create a workable cross-border business relationship.</p></article>
        <article class="about-value-card"><h3>Canada-Side Perspective</h3><p>VICTORIA helps clients understand local buyer expectations, market conditions and the specialists a project may require.</p></article>
        <article class="about-value-card"><h3>China-Side Coordination</h3><p>We support supplier communication, commercial follow-up and practical coordination close to the manufacturing side.</p></article>
        <article class="about-value-card"><h3>A Project-Based Approach</h3><p>We begin with the objective, test assumptions and agree on scope, responsibilities and the next practical action.</p></article>
      </div>
      <aside class="about-landscape" aria-hidden="true">
        <img src="./assets/images/about-embroidered-landscape.webp" alt="" loading="lazy" decoding="async" />
        <p>Two Markets<br /><strong>One Practical Path</strong></p>
      </aside>
    </div>
  </section>
  <section class="section about-principles-section">
    <div class="container">
      <div class="about-principles-heading">
        <div><p class="about-section-label">Our Approach</p><h2>Clear Scope. Relevant Contacts.<br />Practical Follow-Through.</h2></div>
        <p>Different projects require different levels of support. VICTORIA can assist with one defined stage or coordinate an agreed cross-border workstream.</p>
      </div>
      <div class="about-principles-grid">
        <article><h3>Evidence Before Introduction</h3><p>We assess basic fit and clarify the objective before bringing parties into a conversation.</p></article>
        <article><h3>Clear Scope and Deliverables</h3><p>Each engagement should define the work, responsibilities, timing and expected outputs.</p></article>
        <article><h3>One Coordinated Point of Contact</h3><p>Clients receive consistent follow-up across the people and decisions involved in the project.</p></article>
        <article><h3>Confidential, Cross-Cultural Coordination</h3><p>We handle project information carefully and communicate with respect for expectations on both sides.</p></article>
      </div>
    </div>
  </section>
  ${cta("Discuss Your Cross-Border Project")}
  </div>
`;

const insightsPage = () => `
  <section class="page-hero insights-hero fade-in">
    <div class="insights-grid" aria-hidden="true"></div>
    <div class="page-hero-inner">
      <p class="insights-eyebrow">Market Insights</p>
      <h1>Read the Market<br />Before You Move</h1>
      <p>Cross-border decisions improve when demand, channel realities, landed economics and execution risk are considered together—not as separate questions.</p>
    </div>
  </section>

  <section class="section insight-lens-section">
    <div class="container insight-lens-layout">
      <div class="insight-lens-intro">
        <p class="insights-section-label">The Decision Lens</p>
        <h2>Five factors shape a credible opportunity.</h2>
        <p>A promising product is only the starting point. Before resources are committed, the commercial case needs to work across the full route from factory to customer.</p>
      </div>
      <div class="insight-factor-list">
        <article><span>01</span><div><h3>Customer Relevance</h3><p>Who has the problem, how they solve it today and why a new offer would earn attention.</p></div></article>
        <article><span>02</span><div><h3>Route to Market</h3><p>Which channel can reach the customer, what that channel expects and where influence sits in the buying decision.</p></div></article>
        <article><span>03</span><div><h3>Landed Cost and Margin</h3><p>Whether product cost, freight, duties, channel margin and after-sales obligations leave a workable commercial model.</p></div></article>
        <article><span>04</span><div><h3>Market Readiness</h3><p>What must change in the product, documentation, packaging, support or sales story before credible outreach begins.</p></div></article>
        <article><span>05</span><div><h3>Proof Before Scale</h3><p>What can be tested through samples, customer conversations or a limited pilot before a larger commitment is made.</p></div></article>
      </div>
    </div>
  </section>

  <section class="section insight-signals-section">
    <div class="container">
      <div class="insight-signals-heading">
        <div><p class="insights-section-label">Signals We Watch</p><h2>Two markets.<br />One commercial picture.</h2></div>
        <p>Useful insight connects what Canadian customers and channels require with what the Chinese supply side can deliver consistently.</p>
      </div>
      <div class="insight-signal-grid">
        <article class="insight-signal-column canada">
          <p class="signal-kicker">Canada — Demand Side</p>
          <h3>What determines market pull</h3>
          <ul>
            <li><strong>Buyer priorities</strong><span>Performance, reliability, service expectations and the problem that creates urgency.</span></li>
            <li><strong>Channel structure</strong><span>The role of importers, distributors, contractors, retailers and direct sales.</span></li>
            <li><strong>Adoption and switching barriers</strong><span>Switching costs, proof requirements, warranty concerns and internal approval cycles.</span></li>
            <li><strong>Local requirements</strong><span>Documentation, language, packaging, certification and specialist review that may be needed.</span></li>
          </ul>
        </article>
        <article class="insight-signal-column china">
          <p class="signal-kicker">China — Supply Side</p>
          <h3>What determines delivery confidence</h3>
          <ul>
            <li><strong>Capability fit</strong><span>Whether the supplier's real strengths match the product and customer requirement.</span></li>
            <li><strong>Commercial flexibility</strong><span>Minimum order quantities, customization, tooling, payment terms and production timing.</span></li>
            <li><strong>Quality discipline</strong><span>Sample consistency, change control, inspection readiness and corrective-action follow-through.</span></li>
            <li><strong>Export readiness</strong><span>Communication, documentation, packaging and support for the destination market.</span></li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <section class="section insight-questions-section">
    <div class="container insight-questions-layout">
      <div class="insight-questions-intro">
        <p class="insights-section-label">Before You Commit</p>
        <h2>Five questions to resolve before you commit.</h2>
      </div>
      <div class="insight-question-list">
        <article><span>01</span><p>Is the opportunity based on a defined customer need or only a broad market assumption?</p></article>
        <article><span>02</span><p>Can the offer remain competitive after every material landed and channel cost is included?</p></article>
        <article><span>03</span><p>Which requirement could stop the project, and who is qualified to confirm it?</p></article>
        <article><span>04</span><p>What evidence would make a buyer, distributor or supplier take the next step?</p></article>
        <article><span>05</span><p>What is the smallest practical test that can reduce uncertainty before scale?</p></article>
      </div>
    </div>
  </section>

  <section class="section section-soft insight-output-section">
    <div class="container insight-output-layout">
      <div>
        <p class="insights-section-label">From Information to Action</p>
        <h2>A useful insight should lead to a decision.</h2>
        <p class="insight-output-copy">Depending on the question, a focused market brief can clarify the opportunity thesis, identify critical assumptions, surface evidence gaps and define the next test. It is a decision tool—not a guarantee of demand, compliance or commercial results.</p>
      </div>
      <div class="insight-output-grid" aria-label="What a focused market brief can clarify">
        <article><span>01</span><h3>Opportunity Thesis</h3><p>Who the offer is for, why it may matter and where the strongest fit appears.</p></article>
        <article><span>02</span><h3>Critical Assumptions</h3><p>The beliefs about demand, cost, channel or readiness that still need evidence.</p></article>
        <article><span>03</span><h3>Decision Triggers</h3><p>The findings that would support moving forward, changing direction or stopping.</p></article>
        <article><span>04</span><h3>Next Market Test</h3><p>A practical action designed to answer the highest-value unresolved question.</p></article>
      </div>
    </div>
  </section>
  ${cta("Discuss the Market Question Behind Your Next Move", "Discuss a Market Question")}
`;

const requestPage = () => `
  <section class="page-hero request-hero fade-in">
    <div class="page-hero-inner">
      <p class="request-eyebrow">Project Enquiries</p>
      <h1>Tell Us About<br />Your Project</h1>
      <p class="request-deck">A clear path for your next Canada–China project.</p>
      <p class="request-hero-copy">Tell us what you are planning, where you need support and what a successful outcome looks like. We will help define the most practical next step.</p>
      <div class="request-hero-points" aria-label="VICTORIA advantages">
        <span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>
          <strong>Local Market<br />Insight</strong>
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.5 14.5 14.5 9"/><path d="M7.5 17.5 5 20a4.2 4.2 0 0 1-6-6l4-4a4.2 4.2 0 0 1 6 0"/><path d="m16.5 6.5 2.5-2.5a4.2 4.2 0 0 1 6 6l-4 4a4.2 4.2 0 0 1-6 0"/></svg>
          <strong>Relevant<br />Connections</strong>
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20V10h4v10M10 20V5h4v15M16 20v-8h4v8M2 20h20"/></svg>
          <strong>Clear<br />Deliverables</strong>
        </span>
      </div>
    </div>
  </section>
  <section class="section request-section">
    <div class="container request-layout">
      <aside class="request-aside">
        <h2>What Happens Next</h2>
        <p>VICTORIA reviews the scope, identifies any missing information and replies by email to discuss the most practical next step.</p>
        <div class="request-privacy">No account is required. This form prepares an email in your default mail application; your information is not stored by this website.</div>
        <div class="request-support" aria-label="Specialist coordination areas">
          <article class="request-support-item">
            <span class="request-support-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>
            </span>
            <span><strong>Legal &amp; Regulatory</strong><small>Qualified guidance when specialist review is required.</small></span>
          </article>
          <article class="request-support-item">
            <span class="request-support-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="6"/><path d="m9 15-1 6 4-2 4 2-1-6"/><path d="m9.5 10 1.7 1.7 3.3-3.5"/></svg>
            </span>
            <span><strong>Certification</strong><small>Independent expertise coordinated around your product.</small></span>
          </article>
          <article class="request-support-item">
            <span class="request-support-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M3 7h13v10H3z"/><path d="M16 10h3l2 3v4h-5z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>
            </span>
            <span><strong>Customs</strong><small>Professional coordination for documentation and clearance.</small></span>
          </article>
        </div>
      </aside>
      <form class="request-form" id="request-form" novalidate>
        <p class="form-required">Fields marked * are required.</p>
        <div class="form-grid">
          <div class="field">
            <label for="name">Your name *</label>
            <input id="name" name="name" autocomplete="name" aria-describedby="name-error" required />
            <span class="field-error" id="name-error" data-error="name"></span>
          </div>
          <div class="field">
            <label for="company">Company *</label>
            <input id="company" name="company" autocomplete="organization" aria-describedby="company-error" required />
            <span class="field-error" id="company-error" data-error="company"></span>
          </div>
          <div class="field">
            <label for="email">Business email *</label>
            <input id="email" name="email" type="email" autocomplete="email" autocapitalize="none" spellcheck="false" aria-describedby="email-error" required />
            <span class="field-error" id="email-error" data-error="email"></span>
          </div>
          <div class="field">
            <label for="phone">Phone, WhatsApp or WeChat</label>
            <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" />
            <span class="field-error" data-error="phone"></span>
          </div>
          <div class="field field-full">
            <label for="requestType">How can we help?</label>
            <select id="requestType" name="requestType">
              <option value="">Select a request type (optional)</option>
              <option>Source a product</option>
              <option>Find a manufacturer</option>
              <option>Import into Canada</option>
              <option>Enter the Canadian market</option>
              <option>Find buyers or distributors</option>
              <option>Explore the Chinese market</option>
              <option>Arrange a business visit</option>
              <option>Request local representation</option>
              <option>Other cross-border support</option>
            </select>
          </div>
          <div class="field field-full">
            <label for="details">Project details *</label>
            <textarea id="details" name="details" aria-describedby="details-help details-error" required placeholder="For example: product, target market, quantity, timing and desired outcome…"></textarea>
            <small id="details-help">Please do not include passwords, payment details or sensitive personal information.</small>
            <span class="field-error" id="details-error" data-error="details"></span>
          </div>
        </div>
        <div class="form-actions">
          <button class="button button-primary" type="submit">Prepare Email to VICTORIA</button>
          <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
        </div>
      </form>
    </div>
  </section>
`;

const routes = {
  home: homePage,
  products: productsPage,
  buyers: buyersPage,
  manufacturers: manufacturersPage,
  about: aboutPage,
  insights: insightsPage,
  request: requestPage
};

const routeMeta = {
  home: ["VICTORIA Canada | Canada-China Cross-Border Services", "Sourcing, market entry and local business coordination between Canada and China."],
  products: ["Product Sourcing | VICTORIA Canada", "Custom product sourcing, commercial comparison and trade opportunity support."],
  buyers: ["For Canadian Buyers | VICTORIA Canada", "Supplier research, sourcing coordination and import readiness support for Canadian buyers."],
  manufacturers: ["For Chinese Manufacturers | VICTORIA Canada", "Canadian market readiness, buyer outreach and local coordination for Chinese manufacturers."],
  about: ["About VICTORIA Canada | Cross-Border Coordination", "Learn how VICTORIA coordinates practical business work between Canada and China."],
  insights: ["Market Insights | VICTORIA Canada", "A practical decision framework for evaluating Canada-China market opportunities, readiness and risk."],
  request: ["Submit Your Request | VICTORIA Canada", "Tell VICTORIA about your sourcing, market entry or cross-border business project."]
};

const routeFromHash = () => {
  const path = location.hash.replace(/^#\/?/, "").replace(/\/$/, "");
  if (path === "products") return "products";
  if (path === "canadian-buyers") return "buyers";
  if (path === "chinese-manufacturers") return "manufacturers";
  if (path === "about") return "about";
  if (path === "market-insights") return "insights";
  if (path === "request") return "request";
  return "home";
};

function closeMenu() {
  document.querySelector(".primary-nav").classList.remove("open");
  const button = document.querySelector(".menu-button");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", t("Open navigation"));
  button.querySelector(".sr-only").textContent = t("Open navigation");
  document.body.classList.remove("menu-open");
}

function bindRequestForm() {
  const form = document.querySelector("#request-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const required = {
      name: t("Please enter your name."),
      company: t("Please enter your company."),
      email: t("Please enter your business email."),
      details: t("Please describe your project.")
    };
    let valid = true;

    document.querySelectorAll(".field-error").forEach((node) => node.textContent = "");
    form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));

    Object.entries(required).forEach(([name, message]) => {
      const value = String(data.get(name) || "").trim();
      if (!value) {
        document.querySelector(`[data-error="${name}"]`).textContent = message;
        form.elements[name].setAttribute("aria-invalid", "true");
        valid = false;
      }
    });

    const email = String(data.get("email") || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.querySelector('[data-error="email"]').textContent = t("Enter a valid business email.");
      form.elements.email.setAttribute("aria-invalid", "true");
      valid = false;
    }

    const status = document.querySelector("#form-status");
    if (!valid) {
      status.textContent = t("Please review the highlighted fields.");
      form.querySelector(".field-error:not(:empty)")?.closest(".field")?.querySelector("input, select, textarea")?.focus();
      return;
    }

    const requestType = data.get("requestType") || t("General enquiry");
    const subject = encodeURIComponent(`${t("Website request")}: ${requestType} - ${data.get("company")}`);
    const body = encodeURIComponent([
      `${t("Name")}: ${data.get("name")}`,
      `${t("Company")}: ${data.get("company")}`,
      `${t("Email")}: ${data.get("email")}`,
      `${t("Phone / messaging")}: ${data.get("phone") || t("Not provided")}`,
      `${t("Request type")}: ${requestType}`,
      "",
      `${t("Project details")}:`,
      data.get("details")
    ].join("\n"));

    status.textContent = t("Your email application is opening. Review the message and select Send.");
    window.location.href = `mailto:lyneshou79@gmail.com?subject=${subject}&body=${body}`;
  });
}

function render() {
  const route = routeFromHash();
  document.body.dataset.route = route;
  document.querySelector(".site-header").classList.toggle("inner-page", route !== "home");
  const main = document.querySelector("#main-content");
  main.innerHTML = routes[route]();
  const localizedMeta = currentLanguage === "zh" ? i18n.zh.meta[route] : routeMeta[route];
  document.title = localizedMeta[0];
  document.querySelector('meta[name="description"]').setAttribute("content", localizedMeta[1]);
  document.querySelectorAll("[data-route]").forEach((link) => {
    const isActive = link.dataset.route === route;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  closeMenu();
  window.scrollTo({ top: 0, behavior: "instant" });
  translateTree(document.body);
  updateLanguageSwitch();
  bindRequestForm();
  bindHomeReveals();
}

function bindHomeReveals() {
  const items = document.querySelectorAll('body[data-route="home"] .section-heading, body[data-route="home"] .audience-panel, body[data-route="home"] .capabilities-media, body[data-route="home"] .service-item, body[data-route="home"] .process-step, body[data-route="home"] .category-card, body[data-route="home"] .cta-band > *');
  if (!items.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });

  items.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 55}ms`);
    observer.observe(item);
  });
}

document.querySelector(".menu-button").addEventListener("click", () => {
  const nav = document.querySelector(".primary-nav");
  const open = nav.classList.toggle("open");
  document.querySelector(".menu-button").setAttribute("aria-expanded", String(open));
  document.querySelector(".menu-button").setAttribute("aria-label", t(open ? "Close navigation" : "Open navigation"));
  document.querySelector(".menu-button .sr-only").textContent = t(open ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("menu-open", open);
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextLanguage = button.dataset.language;
    if (nextLanguage === currentLanguage) return;
    currentLanguage = nextLanguage;
    localStorage.setItem("victoria-language", currentLanguage);
    render();
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-shell")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelector("#year").textContent = new Date().getFullYear();
window.addEventListener("hashchange", render);
render();
