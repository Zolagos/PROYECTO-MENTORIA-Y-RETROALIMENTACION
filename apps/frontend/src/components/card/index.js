export function Card(title, value, icon = "") {
  return `
    <article class="card">

      <div class="card-icon">
        ${icon}
      </div>

      <div class="card-content">

        <h3>${title}</h3>

        <strong>${value}</strong>

      </div>

    </article>
  `;
}
