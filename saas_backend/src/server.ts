import Fastify from 'fastify';
import { z } from 'zod';

const fastify = Fastify({
  logger: true
});

// --- Schema ---

const VerifySchema = z.object({
  licenseKey: z.string(),
  violations: z.array(z.string())
});

// --- Logic ---

fastify.get('/health', async () => {
  return { status: 'ok' };
});

fastify.post('/api/v1/verify', async (request, reply) => {
  try {
    const payload = VerifySchema.parse(request.body);
    const { licenseKey, violations } = payload;

    fastify.log.info({ msg: "Verification Request", licenseKey, violationsCount: violations.length });

    // 1. Paid Tier Check
    if (licenseKey.startsWith('sk_paid_')) {
      return { status: 'approved', message: 'Premium license accepted.' };
    }

    // 2. Free Tier Check
    if (licenseKey.startsWith('sk_free_')) {
      if (violations.length > 0) {
        // Free tier cannot have violations (strict mode)
        return { status: 'rejected', message: 'Free tier cannot bypass violations. Please fix or upgrade.' };
      }
      return { status: 'approved', message: 'Free tier accepted (Clean build).' };
    }

    // 3. Invalid Key
    return { status: 'rejected', message: 'Invalid license key.' };

  } catch (error) {
    request.log.error(error);
    reply.status(400).send({ status: 'error', message: 'Invalid payload' });
  }
});

// --- Start ---

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running at http://0.0.0.0:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
