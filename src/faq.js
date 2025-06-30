// FAQ JavaScript functionality
document.addEventListener('DOMContentLoaded', function () {
	initializeFAQ()
})

function initializeFAQ() {
	const searchInput = document.getElementById('faqSearch')
	const faqContainer = document.getElementById('faqContainer')
	const noResults = document.getElementById('noResults')
	const faqItems = document.querySelectorAll('.faq-item')
	const faqQuestions = document.querySelectorAll('.faq-question')
	const categoryLinks = document.querySelectorAll('.faq-category')

	// FAQ accordion functionality
	faqQuestions.forEach(question => {
		question.addEventListener('click', function () {
			const answer = this.nextElementSibling
			const icon = this.querySelector('i')

			// Toggle current answer
			if (answer.classList.contains('show')) {
				answer.classList.remove('show')
				icon.classList.remove('bi-chevron-up')
				icon.classList.add('bi-chevron-down')
			} else {
				// Close all other answers
				document.querySelectorAll('.faq-answer.show').forEach(openAnswer => {
					openAnswer.classList.remove('show')
				})
				document.querySelectorAll('.faq-question i').forEach(openIcon => {
					openIcon.classList.remove('bi-chevron-up')
					openIcon.classList.add('bi-chevron-down')
				})

				// Open current answer
				answer.classList.add('show')
				icon.classList.remove('bi-chevron-down')
				icon.classList.add('bi-chevron-up')
			}
		})
	})

	// Search functionality
	searchInput.addEventListener('input', function () {
		const searchTerm = this.value.toLowerCase().trim()
		filterFAQ(searchTerm, 'all')
	})

	// Category filtering
	categoryLinks.forEach(link => {
		link.addEventListener('click', function (e) {
			e.preventDefault()

			// Update active category
			categoryLinks.forEach(l => l.classList.remove('fw-bold', 'text-primary'))
			this.classList.add('fw-bold', 'text-primary')

			const category = this.dataset.category
			const searchTerm = searchInput.value.toLowerCase().trim()
			filterFAQ(searchTerm, category)
		})
	})

	// Set initial active category
	categoryLinks[0].classList.add('fw-bold', 'text-primary')
}

function filterFAQ(searchTerm, category) {
	const faqItems = document.querySelectorAll('.faq-item')
	const noResults = document.getElementById('noResults')
	let visibleCount = 0

	faqItems.forEach(item => {
		const question = item
			.querySelector('.faq-question span')
			.textContent.toLowerCase()
		const answer = item.querySelector('.faq-answer').textContent.toLowerCase()
		const itemCategory = item.dataset.category

		const matchesSearch =
			!searchTerm ||
			question.includes(searchTerm) ||
			answer.includes(searchTerm)
		const matchesCategory = category === 'all' || itemCategory === category

		if (matchesSearch && matchesCategory) {
			item.style.display = 'block'
			visibleCount++

			// Highlight search terms
			if (searchTerm) {
				highlightText(item, searchTerm)
			} else {
				removeHighlight(item)
			}
		} else {
			item.style.display = 'none'
			// Close answer if item is hidden
			const answer = item.querySelector('.faq-answer')
			const icon = item.querySelector('.faq-question i')
			answer.classList.remove('show')
			icon.classList.remove('bi-chevron-up')
			icon.classList.add('bi-chevron-down')
		}
	})

	// Show/hide no results message
	if (visibleCount === 0) {
		noResults.style.display = 'block'
	} else {
		noResults.style.display = 'none'
	}
}

function highlightText(item, searchTerm) {
	const question = item.querySelector('.faq-question span')
	const answer = item.querySelector('.faq-answer')

	// Remove existing highlights
	removeHighlight(item)

	// Highlight in question
	const questionText = question.textContent
	const highlightedQuestion = questionText.replace(
		new RegExp(escapeRegExp(searchTerm), 'gi'),
		match => `<span class="highlight">${match}</span>`
	)
	question.innerHTML = highlightedQuestion

	// Highlight in answer (only text nodes, preserve HTML structure)
	highlightTextNodes(answer, searchTerm)
}

function removeHighlight(item) {
	const question = item.querySelector('.faq-question span')
	const answer = item.querySelector('.faq-answer')

	// Remove highlights from question
	question.textContent = question.textContent

	// Remove highlights from answer
	const highlights = answer.querySelectorAll('.highlight')
	highlights.forEach(highlight => {
		const parent = highlight.parentNode
		parent.replaceChild(
			document.createTextNode(highlight.textContent),
			highlight
		)
		parent.normalize()
	})
}

function highlightTextNodes(element, searchTerm) {
	const walker = document.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT,
		null,
		false
	)

	const textNodes = []
	let node

	while ((node = walker.nextNode())) {
		if (node.textContent.toLowerCase().includes(searchTerm)) {
			textNodes.push(node)
		}
	}

	textNodes.forEach(textNode => {
		const parent = textNode.parentNode
		const text = textNode.textContent
		const regex = new RegExp(escapeRegExp(searchTerm), 'gi')

		if (regex.test(text)) {
			const fragment = document.createDocumentFragment()
			let lastIndex = 0
			let match

			regex.lastIndex = 0
			while ((match = regex.exec(text)) !== null) {
				// Add text before match
				if (match.index > lastIndex) {
					fragment.appendChild(
						document.createTextNode(text.slice(lastIndex, match.index))
					)
				}

				// Add highlighted match
				const highlight = document.createElement('span')
				highlight.className = 'highlight'
				highlight.textContent = match[0]
				fragment.appendChild(highlight)

				lastIndex = match.index + match[0].length
			}

			// Add remaining text
			if (lastIndex < text.length) {
				fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
			}

			parent.replaceChild(fragment, textNode)
		}
	})
}

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function clearSearch() {
	const searchInput = document.getElementById('faqSearch')
	const categoryLinks = document.querySelectorAll('.faq-category')

	searchInput.value = ''

	// Reset to "all" category
	categoryLinks.forEach(l => l.classList.remove('fw-bold', 'text-primary'))
	categoryLinks[0].classList.add('fw-bold', 'text-primary')

	filterFAQ('', 'all')
}

// Auto-expand FAQ item if it matches URL hash
function checkURLHash() {
	const hash = window.location.hash
	if (hash) {
		const targetItem = document.querySelector(hash)
		if (targetItem && targetItem.classList.contains('faq-item')) {
			const question = targetItem.querySelector('.faq-question')
			if (question) {
				question.click()
				targetItem.scrollIntoView({ behavior: 'smooth' })
			}
		}
	}
}

// Check hash on page load and hash change
window.addEventListener('load', checkURLHash)
window.addEventListener('hashchange', checkURLHash)
