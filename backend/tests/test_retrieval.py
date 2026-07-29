from app.services.ingestion.pipeline import ingest_document
from app.services.retrieval import hybrid_search
from tests.conftest import requires_db


@requires_db
def test_keyword_search_surfaces_exact_technology_match(db_session, fake_embedder):
    ingest_document(
        db_session,
        file_bytes=b"Built an event-driven reminder service using NestJS and RabbitMQ.",
        original_filename="backend-project.txt",
    )
    ingest_document(
        db_session,
        file_bytes=b"Co-created cross-platform Android and iOS apps using Java and React Native.",
        original_filename="mobile-project.txt",
    )
    db_session.flush()

    results = hybrid_search(db_session, "NestJS", min_score=0.0)

    assert len(results) > 0
    assert any("NestJS" in r.content for r in results)


@requires_db
def test_relevance_threshold_filters_out_low_scoring_chunks(db_session, fake_embedder):
    ingest_document(
        db_session,
        file_bytes=b"Built a payment microservice with Razorpay webhook reconciliation.",
        original_filename="payments.txt",
    )
    db_session.flush()

    results = hybrid_search(db_session, "payment", min_score=1.1)  # impossible to exceed

    assert results == []


@requires_db
def test_search_only_returns_active_chunks(db_session, fake_embedder):
    doc = ingest_document(
        db_session,
        file_bytes=b"Version one content about GraphQL federation gateways.",
        original_filename="versioned.txt",
    )
    db_session.flush()
    ingest_document(
        db_session,
        file_bytes=b"Version two content about GraphQL federation gateways and caching.",
        original_filename="versioned.txt",
        existing_document_id=doc.id,
    )
    db_session.flush()

    results = hybrid_search(db_session, "GraphQL federation", min_score=0.0, top_k=10)

    assert all("caching" in r.content or "Version two" not in r.content for r in results)
    # every returned chunk must belong to an active source, i.e. the superseded version's
    # chunks (is_active=False) must never appear
    assert all(r.content != "Version one content about GraphQL federation gateways." for r in results)
