import { normalize } from "../lib/normalize";

/** Valor de la pastilla que significa «todo». */
const ALL = "*";

/**
 * Filtros de las listas: por etiqueta y por búsqueda de texto.
 *
 * Marca en el HTML:
 *   [data-filter-root]        contenedor del filtro
 *   [data-filter-pill]        botones de filtro (value = "*" para todos)
 *   [data-filter-search]      input de búsqueda (opcional)
 *   [data-filter-item]        elementos que se filtran
 *   [data-filter-group]       grupos (por año) con su contador
 *   [data-filter-count]       contador de un grupo
 *   [data-filter-empty]       mensaje de «sin resultados»
 *   [data-filter-shown]       «N de M»
 *   [data-filter-label]       etiqueta del filtro activo en el prompt
 *   data-filter-limit="N"     muestra solo los N primeros que cumplen
 *   data-filter-param="tag"   sincroniza el filtro con la URL
 */
export function initFilterLists(): void {
  document
    .querySelectorAll<HTMLElement>("[data-filter-root]")
    .forEach((root) => {
      if (root.dataset.filterBound) return;
      root.dataset.filterBound = "1";

      const pills = Array.from(
        root.querySelectorAll<HTMLButtonElement>("[data-filter-pill]")
      );
      const search = root.querySelector<HTMLInputElement>("[data-filter-search]");
      const items = Array.from(
        root.querySelectorAll<HTMLElement>("[data-filter-item]")
      );
      const groups = Array.from(
        root.querySelectorAll<HTMLElement>("[data-filter-group]")
      );
      const emptyEl = root.querySelector<HTMLElement>("[data-filter-empty]");
      const queryEl = root.querySelector<HTMLElement>("[data-filter-query]");
      const shownEl = root.querySelector<HTMLElement>("[data-filter-shown]");
      const labelEl = root.querySelector<HTMLElement>("[data-filter-label]");
      const limit = Number(root.dataset.filterLimit ?? 0);
      const param = root.dataset.filterParam ?? "";
      const total = items.length;

      let active = ALL;

      const matches = (item: HTMLElement): boolean => {
        const tag = (item.dataset.tag ?? "").toLowerCase();
        const tagOk = active === ALL || tag === active.toLowerCase();
        const query = search ? normalize(search.value.trim()) : "";
        const queryOk = !query || normalize(item.dataset.search ?? "").includes(query);
        return tagOk && queryOk;
      };

      const apply = () => {
        let visible = 0;
        items.forEach((item) => {
          const ok = matches(item);
          item.dataset.match = ok ? "1" : "0";
          if (ok) visible++;
        });

        // El límite (si lo hay) deja visibles solo los primeros que cumplen.
        let shown = 0;
        items.forEach((item) => {
          if (item.dataset.match !== "1" || (limit && shown >= limit)) {
            item.hidden = true;
            return;
          }
          item.hidden = false;
          shown++;
        });

        // Grupos: se recalculan los contadores y se ocultan los vacíos.
        groups.forEach((group) => {
          const count = Array.from(
            group.querySelectorAll<HTMLElement>("[data-filter-item]")
          ).filter((item) => item.dataset.match === "1").length;
          const counter = group.querySelector<HTMLElement>("[data-filter-count]");
          if (counter) {
            const singular = group.dataset.singular ?? "artículo";
            const plural = group.dataset.plural ?? "artículos";
            counter.textContent =
              count === 1 ? `1 ${singular}` : `${count} ${plural}`;
          }
          group.hidden = count === 0;
        });

        if (emptyEl) emptyEl.hidden = visible > 0;
        if (queryEl) queryEl.textContent = search ? search.value.trim() : "";
        if (shownEl) shownEl.textContent = `${shown} de ${total}`;

        pills.forEach((pill) => {
          const on = (pill.dataset.filterPill ?? ALL) === active;
          pill.setAttribute("aria-pressed", String(on));
        });

        if (labelEl) {
          labelEl.textContent = active === ALL ? ALL : active.toLowerCase();
        }

        if (param) {
          const url = new URL(window.location.href);
          if (active === ALL) url.searchParams.delete(param);
          else url.searchParams.set(param, active);
          history.replaceState(null, "", url);
        }
      };

      // Estado inicial: el que venga en la URL (?tag=Seguridad, ?type=web).
      if (param) {
        const value = new URL(window.location.href).searchParams.get(param);
        const pill = pills.find(
          (p) => (p.dataset.filterPill ?? "").toLowerCase() === (value ?? "").toLowerCase()
        );
        if (pill) active = pill.dataset.filterPill ?? ALL;
      }

      pills.forEach((pill) => {
        pill.addEventListener("click", () => {
          active = pill.dataset.filterPill ?? ALL;
          apply();
        });
      });

      if (search) {
        search.addEventListener("input", apply);
      }

      apply();
    });
}

document.addEventListener("astro:page-load", initFilterLists);
