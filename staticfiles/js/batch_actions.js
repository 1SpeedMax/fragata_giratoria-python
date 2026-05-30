// static/js/batch_actions.js

(function(){
    'use strict';

    function getCsrfToken() {
        // Try to read from cookie first
        const name = 'csrftoken';
        const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
        if (match) return match.pop();

        // Fallback: look for a csrf input in any form
        const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
        return csrfInput ? csrfInput.value : '';
    }

    function closestParentWith(selector, el) {
        while (el && el !== document.body) {
            if (el.matches && el.matches(selector)) return el;
            el = el.parentNode;
        }
        return null;
    }

    function gatherSelectedIds(container) {
        const selected = container.querySelectorAll('.row-select:checked');
        return Array.from(selected).map(cb => cb.value);
    }

    function updateButtonsState(container) {
        const selectedCount = container.querySelectorAll('.row-select:checked').length;
        const deleteBtn = container.querySelector('.btn-delete-batch') || container.querySelector('#deleteSelected');
        const exportBtn = container.querySelector('.btn-export-batch') || container.querySelector('#exportSelected');
        if (deleteBtn) deleteBtn.disabled = selectedCount === 0;
        if (exportBtn) exportBtn.disabled = selectedCount === 0;

        if (deleteBtn) {
            deleteBtn.innerHTML = `<i class="fas fa-trash"></i> Eliminar${selectedCount>0?` (${selectedCount})`:''}`;
        }
        if (exportBtn) {
            exportBtn.innerHTML = `<i class="fas fa-file-export"></i> Exportar${selectedCount>0?` (${selectedCount})`:''}`;
        }
    }

    function hookContainer(container) {
        if (!container) return;

        const selectAll = container.querySelector('.select-all-checkbox') || container.querySelector('#selectAll');
        const rowCheckboxes = container.querySelectorAll('.row-select');
        const deleteBtn = container.querySelector('.btn-delete-batch') || container.querySelector('#deleteSelected');
        const exportBtn = container.querySelector('.btn-export-batch') || container.querySelector('#exportSelected');

        // Attach row checkbox handlers
        rowCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                const tr = cb.closest('tr');
                if (tr) tr.classList.toggle('row-selected', cb.checked);
                if (selectAll) {
                    const all = container.querySelectorAll('.row-select');
                    const checked = container.querySelectorAll('.row-select:checked');
                    selectAll.checked = checked.length === all.length && all.length>0;
                    selectAll.indeterminate = checked.length>0 && checked.length<all.length;
                }
                updateButtonsState(container);
            });
        });

        // Select all handler
        if (selectAll) {
            selectAll.addEventListener('change', function() {
                rowCheckboxes.forEach(cb => {
                    cb.checked = selectAll.checked;
                    const tr = cb.closest('tr');
                    if (tr) tr.classList.toggle('row-selected', cb.checked);
                });
                updateButtonsState(container);
            });
        }

        // Delete handler
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e){
                e.preventDefault();
                const ids = gatherSelectedIds(container);
                if (ids.length === 0) return;
                if (!confirm(ids.length === 1 ? '¿Eliminar este registro?' : `¿Eliminar ${ids.length} registros seleccionados?`)) return;

                // If there is a batchForm in scope, submit it (used by pedidos)
                const batchForm = container.querySelector('#batchForm') || document.getElementById('batchForm');
                if (batchForm) {
                    const actionInput = batchForm.querySelector('input[name="action"]') || (() => {
                        const i = document.createElement('input');
                        i.type = 'hidden'; i.name = 'action'; batchForm.appendChild(i); return i;
                    })();
                    actionInput.value = 'delete';
                    batchForm.submit();
                    return;
                }

                // Otherwise create a POST form to current page with delete_ids
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = window.location.pathname;
                form.style.display = 'none';

                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrfmiddlewaretoken';
                csrfInput.value = getCsrfToken();
                form.appendChild(csrfInput);

                // Some backends expect delete_ids (comma separated), others expect ids[] inputs
                const deleteInput = document.createElement('input');
                deleteInput.type = 'hidden';
                deleteInput.name = 'delete_ids';
                deleteInput.value = ids.join(',');
                form.appendChild(deleteInput);

                ids.forEach(id => {
                    const idInput = document.createElement('input');
                    idInput.type = 'hidden'; idInput.name = 'ids'; idInput.value = id; form.appendChild(idInput);
                });

                document.body.appendChild(form);
                form.submit();
            });
        }

        // Export handler
        if (exportBtn) {
            exportBtn.addEventListener('click', function(e){
                e.preventDefault();
                const ids = gatherSelectedIds(container);
                if (ids.length === 0) return;

                // If batchForm exists, use it with action=export
                const batchForm = container.querySelector('#batchForm') || document.getElementById('batchForm');
                if (batchForm) {
                    const actionInput = batchForm.querySelector('input[name="action"]') || (() => {
                        const i = document.createElement('input');
                        i.type = 'hidden'; i.name = 'action'; batchForm.appendChild(i); return i;
                    })();
                    ids.forEach(id => {
                        const existing = batchForm.querySelector(`input[name="pedido_ids"][value="${id}"]`);
                        if (!existing) {
                            const idInput = document.createElement('input');
                            idInput.type = 'hidden'; idInput.name = 'pedido_ids'; idInput.value = id; batchForm.appendChild(idInput);
                        }
                    });
                    actionInput.value = 'export';
                    batchForm.submit();
                    return;
                }

                // If button has data-export-url attribute, use it
                const exportUrl = exportBtn.dataset.exportUrl;
                if (exportUrl) {
                    const url = new URL(exportUrl, window.location.origin);
                    url.searchParams.set('ids', ids.join(','));
                    window.location.href = url.toString();
                    return;
                }

                // Try to navigate to a common export URL pattern
                const guessUrl1 = `${window.location.pathname}exportar-seleccionados/`;
                const guessUrl2 = `${window.location.pathname}exportar/excel/`;
                const guessUrl3 = `${window.location.pathname.replace(/\/$/, '')}/exportar-seleccionados/`;

                // Prefer GET to trigger download
                const tryUrl = guessUrl1;
                window.location.href = `${tryUrl}?ids=${ids.join(',')}`;
            });
        }

        // Initial state update
        updateButtonsState(container);
    }

    document.addEventListener('DOMContentLoaded', function(){
        // Find all batch-actions containers and hook them
        const batchBlocks = document.querySelectorAll('.batch-actions');
        batchBlocks.forEach(block => hookContainer(block.closest('main') || block.parentNode || document));

        // Also hook generic table wrappers
        const tableWrappers = document.querySelectorAll('.table-wrapper, .table-responsive, table');
        tableWrappers.forEach(wrapper => {
            // If the wrapper contains row-select checkboxes
            if (wrapper.querySelector && wrapper.querySelector('.row-select')) {
                hookContainer(closestParentWith('div, main, section, body', wrapper) || document);
            }
        });
    });
})();
